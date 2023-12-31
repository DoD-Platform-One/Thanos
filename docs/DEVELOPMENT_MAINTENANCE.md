# How to upgrade the Thanos Package chart

This chart is reconciled against the [upstream chart](https://github.com/bitnami/charts/tree/main/bitnami/thanos) as declared in the [Kptfile](../chart/Kptfile).

When an upgrade is required, `kpt` can be ran to pull the updates with a targeted tag.

(from the repository root)
`kpt pkg update chart@<new tag> --strategy alpha-git-patch`

Once completed, you will need to reconcile the modifications that Big Bang makes.

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

Because Thanos aggregates data, it makes sense to integrate Thanos with Prometheus, MiniIO, and Grafana.
The cypress tests will verify datasources are enabled for the monitoring.prometheus-sidecar and an s3 objectstore datasource is registered.  See the values.yaml and bigbang test-values.yaml for configuration settings.  

When using the bigbang install (monitoring/grafana/thanos/and passing in test-values.yaml, you should be able to:

1. Go to [https://thanos.bigbang.dev](https://thanos.bigbang.dev)
2. Select "Stores" and verify you see the `Sidecar` and `Store` stores.  These should both be `UP`.
3. Go to [https://grafana.bigbang.dev/connections/datasources/edit/prometheus](https://grafana.bigbang.dev/connections/datasources/edit/prometheus) and verify the grafana datasource 
   by clicking `Save & test`

