# How to upgrade the Thanos Package chart

1. Navigate to the upstream [chart repo and folder](https://github.com/bitnami/charts/tree/main/bitnami/thanos) and find the tag/hash that corresponds with the new chart version for this update
    - To find this hash, search the bitnami [commits](https://github.com/bitnami/charts/blame/main/bitnami/thanos/Chart.yaml#L38) till you find the chart version bump commit to master.  This is the hash you will want to use in your KPT pkg update.
    - Check the [upstream release](https://thanos.io/tip/thanos/changelog.md/#changelog) notes for upgrade notices.

2. Checkout the `renovate/ironbank` branch

3. kpt
    - From the root of the repo run `kpt pkg update chart@<tag / hash> --strategy alpha-git-patch`, where the tag/hash is found in step 1
        - `kpt` can be ran to pull the updates with a targeted tag.  In thanos's case we will need the commit hash instead due to the lack of tags on the upstream repo.
        - Run a KPT package update
        ```shell
        kpt pkg update chart@<tag / hash> --strategy alpha-git-patch
        ```
        - Reconcile the modifications by following the `Modifications Made to the upstream chart` section of this document for a list of changes per file to be aware of, for how Big Bang differs from upstream.
    - From the root of the repo once again, run `kpt pkg update chart/templates@<hash> --strategy alpha-git-patch`.

4. Modify the version in `Chart.yaml` and append `-bb.0` to the chart version from upstream. See `Update main chart` section of this document.

5. Update dependencies and binaries using `helm dependency update ./chart`

    - Pull assets and commit the binaries as well as the Chart.lock file that was generated.
      ```shell
      helm dependency update ./chart
      ```

6. Update `CHANGELOG.md` adding an entry for the new version and noting all changes in a list (at minimum should include `- Updated <chart or dependency> to x.x.x`).

7. Generate the `README.md` updates by following the [guide in gluon](https://repo1.dso.mil/big-bang/product/packages/gluon/-/blob/master/docs/bb-package-readme.md).

8. Push up your changes, add upgrade notices if applicable, validate that CI passes. 

    - If there are any failures, follow the information in the pipeline to make the necessary updates. 

    - Add the `debug` label to the MR for more detailed information. 
    
    - Reach out to the CODEOWNERS if needed.

9. Follow the `Testing a new Thanos version` section of this document for manual testing.

# Modifications Made to the upstream chart

## /chart/Chart.yaml
- Modified Version to include `-bb.x` suffix
- Modified to use registry1 minio package dependency

## /chart/bigbang/*
- Network Policies and other common BigBang charts added

## chart/values.yaml
- Add common values for Big Bang packages for domain, networkpolicies, tests, and Istio
- Update image registry/repository/tag as required by update
- Add image pull secret for `private-registry`
- Set resource requests/limits

## chart/Kptfile
- Tracks current upstream chart

### automountServiceAccountToken
The mutating Kyverno policy named `update-automountserviceaccounttokens` is leveraged to harden all ServiceAccounts in this package with `automountServiceAccountToken: false`. This policy is configured by namespace in the Big Bang umbrella chart repository at [chart/templates/kyverno-policies/values.yaml](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/chart/templates/kyverno-policies/values.yaml?ref_type=heads). 

This policy revokes access to the K8s API for Pods utilizing said ServiceAccounts. If a Pod truly requires access to the K8s API (for app functionality), the Pod is added to the `pods:` array of the same mutating policy. This grants the Pod access to the API, and creates a Kyverno PolicyException to prevent an alert.

# Testing a new Thanos version

> NOTE: For these testing steps it is good to do them on both a clean install and an upgrade. For clean install, point Thanos to your branch. For an upgrade do an install with Thanos pointing to the latest tag, then perform a helm upgrade with Thanos pointing to your branch.

> Because Thanos aggregates data, it makes sense to integrate Thanos with Prometheus, MiniIO, and Grafana.
The cypress tests will verify datasources are enabled for the monitoring.prometheus-sidecar and an s3 objectstore datasource is registered.  See the values.yaml and bigbang test-values.yaml for configuration settings.  

You will want to install with:

   - Thanos, Monitoring, Grafana and Istio packages and passing in test-values.yaml

`overrides/thanos.yaml`
```yaml
flux:
  interval: 1m
  rollback:
    cleanupOnFail: false

clusterAuditor:
  enabled: false

grafana:
  enabled: true

istioOperator:
  enabled: true

istio:
  enabled: true

monitoring:
  enabled: true
  values:
    prometheus:
      prometheusSpec:
        replicas: 3
    istio:
      enabled: true
      hardened:
        enabled: true

addons:
  thanos:
    enabled: true
    git:
      tag: null
      branch: "renovate/ironbank"
    values:
      istio:
        enabled: true
        hardened:
          enabled: true
      minio:
        enabled: true
      storegateway:
        enabled: true
      objstoreConfig: |-
        type: s3
        config:
          bucket: "thanos"
          endpoint: minio.thanos.svc.cluster.local:80
          access_key: "minio"
          secret_key: "minio123"
          insecure: true
          trace:
            enable: true
  minioOperator:
    enabled: true
```

- Go to [https://thanos.dev.bigbang.mil](https://thanos.dev.bigbang.mil)
   - Select "Stores" and verify you see the `Sidecar` and `Store` stores.  These should both be `UP`.
- Verify that [https://thanos.bigbang.dev/status](https://thanos.bigbang.dev/status) shows the correct thanos version.
- Go to [https://grafana.dev.bigbang.mil/d/alertmanager-overview/alertmanager-overview](https://grafana.dev.bigbang.mil/d/alertmanager-overview/alertmanager-overview) and login with [default credentials](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/docs/guides/using-bigbang/default-credentials.md) or SSO
   - Verify the `Thanos` grafana datasource by changing the dashboard's datasource to `Thanos`, data should be displaying properly.

> When in doubt with any testing or upgrade steps, reach out to the CODEOWNERS for assistance.