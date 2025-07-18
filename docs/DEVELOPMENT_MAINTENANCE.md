# How to upgrade the Thanos Package chart

1. Navigate to the upstream [chart repo and folder](https://github.com/bitnami/charts/tree/main/bitnami/thanos) and find the tag/hash that corresponds with the new chart version for this update
    - To find this hash, search the bitnami [commits](https://github.com/bitnami/charts/blame/main/bitnami/thanos/Chart.yaml#L38) until you find the chart version bump commit to master.  This is the hash you will want to use in your KPT pkg update.
    - Check the [upstream release](https://thanos.io/tip/thanos/changelog.md/#changelog) notes for upgrade notices.

2. Checkout the `renovate/ironbank` branch

3. kpt
    - From the root of the repo run `kpt pkg update chart@<tag / hash> --strategy alpha-git-patch`, where the tag/hash is found in step 1
        - `kpt` can be run to pull the updates with a targeted tag
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

10. As part of your MR that modifies bigbang packages, you should modify the bigbang [bigbang/tests/test-values.yaml](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/tests/test-values.yaml?ref_type=heads) against your branch for the CI/CD MR testing by enabling your packages.

    - To do this, at a minimum, you will need to follow the instructions at [bigbang/docs/developer/test-package-against-bb.md](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/docs/developer/test-package-against-bb.md?ref_type=heads) with changes for Thanos enabled (the below is a reference, actual changes could be more depending on what changes were made to Thanos in the package MR).

### [test-values.yaml](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/tests/test-values.yaml?ref_type=heads)

```yaml
thanos:
  enabled: true
  git:
    tag: null
    branch: renovate/ironbank
  values:
    istio:
      hardened:
        enabled: true
  ### Additional components of Thanos should be changed to reflect testing changes introduced in the package MR
```

# Modifications Made to the upstream chart

## /chart/Chart.yaml

- Modified Version to include `-bb.x` suffix
- Modified to use registry1 minio package dependency

## /chart/bigbang/*

- Network Policies and other common BigBang charts added

## chart/values.yaml

- Add common values for Big Bang packages for domain, networkpolicies, upgradejob, tests, and Istio
- Update image registry/repository/tag as required by update
- Add image pull secret for `private-registry`
- Set resource requests/limits
- Disable Pod Disruption Budgets

### Check for Big Bang specifics included in Thanos chart/values.yaml

- Please check and update the following line references if any upstream modify the line numbers

Line 58-59 ensure sso.enabled to false

```
sso:
  enabled: false
```

Line 71-73 ensure registry/repository points to ironbank

```
  registry: registry1.dso.mil
  repository: ironbank/opensource/thanos/thanos 
  tag: vx.xx.x
```

Line 85-86 set pullSecrets to `private-registry`

```
  pullSecrets:  
    - private-registry
```

Line 277-283 Ensure query.resources has been set

```
  resources:
      limits:
        cpu: 300m
        memory: 5Gi
      requests:
        cpu: 300m
        memory: 5Gi
```

Line 694-701 Comment out existingServiceAccount: "" and add DEPRECATED comment about query.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented

```
  ## DEPRECATED query.serviceAccount.existingServiceAccount - This value has been deprecated and will be removed in a future release, please use `serviceAccount.name` in combination with `serviceAccount.create=false` instead
  ##
  serviceAccount:
    create: true
    name: ""
    annotations: {}
    automountServiceAccountToken: false
    ## existingServiceAccount: ""
```

Line 1053-1059 set the queryFrontend.resources

```
  resources:
      limits:
        cpu: 100m
        memory: 100Mi
      requests:
        cpu: 100m
        memory: 100Mi
```

Line 1339-1345 Comment out existingServiceAccount: "" and add DEPRECATED comment about queryFrontend.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented

```
Comment out existingServiceAccount: "" and add DEPRECATED comment about queryFrontend.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented
  ##
  serviceAccount:
    create: true
    name: ""
    annotations: {}
    automountServiceAccountToken: false
    ## existingServiceAccount: ""
```

Line 1585-1594 set the bucketweb.resources like below

```
  ## @param bucketweb.resources.limits The resources limits for the Thanos Bucket Web container
  ## @param bucketweb.resources.requests The requested resources for the Thanos Bucket Web container
  ##
  resources:
      limits:
        cpu: 100m
        memory: 100Mi
      requests:
        cpu: 100m
        memory: 100Mi
```

Line 1872-1878 Comment out existingServiceAccount: "" and add DEPRECATED comment about bucketweb.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented

```
Comment out existingServiceAccount: "" and add DEPRECATED comment about bucketweb.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented
  ##
  serviceAccount:
    create: true
    name: ""
    annotations: {}
    automountServiceAccountToken: false
    ## existingServiceAccount: ""
```

Line 2133-2142 set the compactor.resources like below

```
  ## @param compactor.resources.limits The resources limits for the Thanos Compactor container
  ## @param compactor.resources.requests The requested resources for the Thanos Compactor container
  ##
  resources:
      limits:
        cpu: 100m
        memory: 100Mi
      requests:
        cpu: 100m
        memory: 100Mi
```

Line 2422-2428 Comment out existingServiceAccount: "" and add DEPRECATED comment about compactor.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented

```
Comment out existingServiceAccount: "" and add DEPRECATED comment about compactor.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented
  ##
  serviceAccount:
    create: true
    name: ""
    annotations: {}
    automountServiceAccountToken: false
    ## existingServiceAccount: ""
```

Line 2698-2707 set the storegateway.resources like below

```
  ## @param storegateway.resources.limits The resources limits for the Thanos Store Gateway container
  ## @param storegateway.resources.requests The requested resources for the Thanos Store Gateway container
  ##
  resources:
      limits:
        cpu: 100m
        memory: 100Mi
      requests:
        cpu: 100m
        memory: 100Mi
```

Line 3043-3049 Comment out existingServiceAccount: "" and add DEPRECATED comment about storegateway.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented

```
Comment out existingServiceAccount: "" and add DEPRECATED comment about storegateway.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented
  ##
  serviceAccount:
    create: true
    name: ""
    annotations: {}
    automountServiceAccountToken: false
    ## existingServiceAccount: ""
```

Line 3455-3464 set the storegateway.resources like below

```
  ## @param ruler.resources.limits The resources limits for the Thanos Ruler container
  ## @param ruler.resources.requests The requested resources for the Thanos Ruler container
  ##
  resources:
      limits:
        cpu: 100m
        memory: 100Mi
      requests:
        cpu: 100m
        memory: 100Mi
```

Line 3797-3803 Comment out existingServiceAccount: "" and add DEPRECATED comment about ruler.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented

```
## DEPRECATED ruler.serviceAccount.existingServiceAccount - This value has been deprecated and will be removed in a future release, please use `serviceAccount.name` in combination with `serviceAccount.create=false` instead
  ##
  serviceAccount:
    create: true
    name: ""
    annotations: {}
    automountServiceAccountToken: false
    ## existingServiceAccount: ""
```

Line 4073-4082 set the receive.resources like below

```
  ## @param receive.resources.limits The resources limits for the Thanos Receive container
  ## @param receive.resources.requests The requested resources for the Thanos Receive container
  ##
  resources:
      limits:
        cpu: 100m
        memory: 100Mi
      requests:
        cpu: 100m
        memory: 100Mi
```

Line 4385-4392 Comment out existingServiceAccount: "" and add DEPRECATED comment about receive.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented

```
  ## DEPRECATED receive.serviceAccount.existingServiceAccount - This value has been deprecated and will be removed in a future release, please use `serviceAccount.name` in combination with `serviceAccount.create=false` instead
  ##
  serviceAccount:
    create: true
    name: ""
    annotations: {}
    automountServiceAccountToken: false
    ## existingServiceAccount: ""
```

Line 4646-4655 set the receiveDistributor.resources like below

```
  ## @param receiveDistributor.resources.limits The resources limits for the Thanos Receive container
  ## @param receiveDistributor.resources.requests The requested resources for the Thanos Receive container
  ##
  resources:
      limits:
        cpu: 100m
        memory: 100Mi
      requests:
        cpu: 100m
        memory: 100Mi
```

Line 4835-4842 Comment out existingServiceAccount: "" and add DEPRECATED comment about storegateway.serviceAccount.existingServiceAccount while leaving the rest of serviceAccount as is, uncommented

```
  ## DEPRECATED receive.serviceAccount.existingServiceAccount - This value has been deprecated and will be removed in a future release, please use `serviceAccount.name` in combination with `serviceAccount.create=false` instead
  ##
  serviceAccount:
    create: true
    name: ""
    annotations: {}
    automountServiceAccountToken: false
    ## existingServiceAccount: ""
```

Line 5032-5034 update image to point to registry/repository ironbank/big-bang/base

```
    registry: registry1.dso.mil
    repository: ironbank/big-bang/base
    tag: 2.1.0
```

Line 5053-5098 ensure the minio is set as follows below

```
  ## to be used as an objstore for Thanos, must have minio-operator installed
  enabled: false
  # -- Minio root credentials
  secrets:
    name: "thanos-objstore-creds"
    accessKey: "minio"
    secretKey: "minio123" # default key, change this!
  tenant:
    # -- Buckets to be provisioned to for tenant
    buckets:
      - name: thanos
    # -- Users to to be provisioned to for tenant
    users:
      - name: minio-user
    # -- User credentials to create for above user. Otherwise password is randomly generated.
    # This auth is not required to be set or reclaimed for minio use with Loki
    defaultUserCredentials:
      username: "minio-user"
      password: ""
    ## Specification for MinIO Pool(s) in this Tenant.
    pools:
      - servers: 1
        volumesPerServer: 4
        size: 750Mi
        securityContext:
          runAsUser: 1001
          runAsGroup: 1001
          fsGroup: 1001
          runAsNonRoot: true
        containerSecurityContext:
          runAsUser: 1001
          runAsGroup: 1001
          runAsNonRoot: true
          capabilities:
            drop:
              - ALL
    metrics:
      enabled: false
      port: 9000
      memory: 128M

## @section NetWorkPolicy parameters

networkPolicy:
  ## @param networkPolicy.enabled Enable creation of NetworkPolicy resources. Only Ingress traffic is filtered for now.
```

Line 5101-5215

```
  ## @param networkPolicy.allowExternal Don't require client label for connections
  ## The Policy model to apply. When set to false, only pods with the correct
  ## client label will have network access to http and grpc thanos port.
  ## When true, thanos will accept connections from any source
  ## (with the correct destination port).
  ##
  allowExternal: true
  ## @param networkPolicy.explicitNamespacesSelector A Kubernetes LabelSelector to explicitly select namespaces from which traffic could be allowed
  ## If explicitNamespacesSelector is missing or set to {}, only client Pods that are in the networkPolicy's namespace
  ## and that match other criteria, the ones that have the good label, can reach thanos.
  ## But sometimes, we want thanos to be accessible to clients from other namespaces, in this case, we can use this
  ## LabelSelector to select these namespaces, note that the networkPolicy's namespace should also be explicitly added.
  ##
  ## Example:
  ## explicitNamespacesSelector:
  ##   matchLabels:
  ##     role: frontend
  ##   matchExpressions:
  ##    - {key: role, operator: In, values: [frontend]}
  ##
  explicitNamespacesSelector: {}

# -- Domain to service Thanos virtualService
domain: bigbang.dev

istio:
  enabled: false
  hardened:
    enabled: false
    outboundTrafficPolicyMode: "REGISTRY_ONLY"
    customServiceEntries: []
    #   - name: "allow-google"
    #     enabled: true
    #     spec:
    #       hosts:
    #         - google.com
    #       location: MESH_EXTERNAL
    #       ports:
    #         - number: 443
    #           protocol: TLS
    #           name: https
    #       resolution: DNS  
    customAuthorizationPolicies: []
    # - name: "allow-nothing"
    #   enabled: true
    #   spec: {}
    minioOperator:
      enabled: true
      namespaces:
        - minio-operator
      principals:
        - cluster.local/ns/minio-operator/sa/minio-operator
    prometheus:
      enabled: true
      namespaces:
        - monitoring
      principals:
        - cluster.local/ns/monitoring/sa/monitoring-grafana
  mtls:
    # STRICT = Allow only mutual TLS traffic
    # PERMISSIVE = Allow both plain text and mutual TLS traffic
    mode: STRICT
  thanos:
    enabled: true
    labels: {}
    annotations: {}
    gateways:
      - istio-system/main
    hosts:
      - thanos.{{ .Values.domain }}

networkPolicies:
  enabled: false
  ingressLabels:
    app: istio-ingressgateway
    istio: ingressgateway  
  additionalPolicies: []
  # expected use case is to open egress for runner jobs
  # This is a dev example policy spec and CIDR 0.0.0.0/0 is unsafe for operational environments
  # requests to controlPlane should also be blocked in an operational policy
  # - name: egress-runner-jobs
  #   spec:
  #     podSelector: {}
  #     policyTypes:
  #     - Egress
  #     egress:
  #     - to:
  #       - ipBlock:
  #           cidr: 0.0.0.0/0
  #           except:
  #           # Block requests to AWS cloud metadata IP
  #           - 169.254.169.254/32
  #           # Block requests to controlPlane if CIDR not 0.0.0.0/0
  #           # - "{{ $.Values.networkPolicies.controlPlaneCidr }}"

upgradeJob:
  name: thanos-upgrade-job
  image:
    repository: registry1.dso.mil/ironbank/opensource/kubernetes/kubectl
    tag: v1.29.8
    imagePullPolicy: IfNotPresent
    pullSecrets: private-registry
  checkVersion: 15.7.27-bb.1
  serviceAccount: upgrade-job-svc-account
  role: upgrade-role
  roleBinding: upgrade-rolebinding

bbtests:
  enabled: false
  cypress:
    artifacts: true
    envs:
      cypress_thanos_url: 'http://thanos-query:9090'
      cypress_minio_url: 'http://thanos-minio-console:9090'
      prometheus_integration_enabled: "false"
      objstorage_integration_enabled: "false"
```

## chart/Kptfile

- Tracks current upstream chart

### automountServiceAccountToken

The mutating Kyverno policy named `update-automountserviceaccounttokens` is leveraged to harden all ServiceAccounts in this package with `automountServiceAccountToken: false`. This policy is configured by namespace in the Big Bang umbrella chart repository at [chart/templates/kyverno-policies/values.yaml](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/chart/templates/kyverno-policies/values.yaml?ref_type=heads).

This policy revokes access to the K8s API for Pods utilizing said ServiceAccounts. If a Pod truly requires access to the K8s API (for app functionality), the Pod is added to the `pods:` array of the same mutating policy. This grants the Pod access to the API, and creates a Kyverno PolicyException to prevent an alert.

# Testing a new Thanos version

> NOTE: For these testing steps it is good to do them on both a clean install and an upgrade. For clean install, point Thanos to your branch. For an upgrade do an install with Thanos pointing to the latest tag, then perform a helm upgrade with Thanos pointing to your branch.

> Because Thanos aggregates data, it makes sense to integrate Thanos with Prometheus, MiniIO, and Grafana.
The cypress tests will verify datasources are enabled for the monitoring.prometheus-sidecar and an s3 objectstore datasource is registered. See the values.yaml and bigbang test-values.yaml for configuration settings.  

You will want to install with:

- Thanos, Monitoring, Grafana and Istio packages and passing in test-values.yaml

`overrides/thanos.yaml`

```yaml
flux:
  interval: 1m
  rollback:
    cleanupOnFail: false

networkPolicies:
  enabled: true

grafana:
  enabled: true

istioCRDs:
  enabled: true

istiod:
  enabled: true
  values:
    hardened:
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
        enabled: false
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

kyverno:
  enabled: true

kyvernoPolicies:
  enabled: true
  values:
    exclude:
      any:
      # Allows k3d load balancer to bypass policies.
      - resources:
          namespaces:
          - istio-system
          names:
          - svclb-*
    policies:
      restrict-host-path-mount-pv:
        parameters:
          allow:
          - /var/lib/rancher/k3s/storage/pvc-*
```

- Go to [https://thanos.dev.bigbang.mil](https://thanos.dev.bigbang.mil)
  - Select "Endpoints" and verify you see the `Sidecar` and `Store` stores.  These should both be `UP`.
- Verify that [https://thanos.dev.bigbang.mil/status](https://thanos.dev.bigbang.mil/status) shows the correct thanos version.
- Go to [https://grafana.dev.bigbang.mil/d/alertmanager-overview/alertmanager-overview](https://grafana.dev.bigbang.mil/d/alertmanager-overview/alertmanager-overview) and login with [default credentials](https://repo1.dso.mil/big-bang/bigbang/-/blob/master/docs/guides/using-bigbang/default-credentials.md) or SSO
  - Verify the `Thanos` grafana datasource by changing the dashboard's datasource to `Thanos`, data should be displaying properly.

> When in doubt with any testing or upgrade steps, reach out to the CODEOWNERS for assistance.
