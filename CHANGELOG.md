# Changelog

---
## [16.0.2-bb.0] - 2025-04-21

### Changed
- gluon updated from 0.5.14 to 0.5.15
- ironbank/opensource/thanos/thanos from v0.37.2 -> v0.38.0
- registry1.dso.mil/ironbank/opensource/kubernetes/kubectl from v1.30.10 -> v1.32.3
- registry1.dso.mil/ironbank/opensource/thanos/thanos from v0.37.2 -> v0.38.0
- thanos chart updated from 15.9.1 to 16.0.2

## [15.9.1-bb.2] - 2025-03-28

### Added

- Added dynamic NetworkPolicy support for Istio operatorless

## [15.9.1-bb.2] - 2025-03-07

### Upgraded

- Upgraded kutectl from `1.30.9` to `1.30.10`
- Upgraded bitnami-common `2.29.1` to `2.30.0`

## [15.9.1-bb.1] - 2025-02-12

### Upgraded

- Upgraded gluon from `0.5.12` -> `0.5.14`
- Upgraded minio-instance from `6.0.4-bb.5` -> `7.0.0-bb.1`
- Upgraded common from `2.29.0` -> `2.29.1`

## [15.9.1-bb.0] - 2025-01-03

### Upgraded

- Upgraded minio-instance from `6.0.4-bb.2` -> `6.0.4-bb.5`
- Upgraded thanos image from `v0.36.1` -> `v0.37.2`
- Upgraded gluon from `0.5.10` -> `0.5.12`


## [15.8.1-bb.0] - 2024-11-18

### Upgraded

- Upgraded gluon from `0.5.4` -> `0.5.10`
- Upgraded minio-instance from `6.0.3-bb.2` -> `6.0.4-bb.2`
- Upgraded kubectl image from `v1.29.8` -> `v1.30.6`
- Added the maintenance track annotation and badge

## [15.7.27-bb.3] - 2024-10-25

### Changed

- Moved pre-upgrade hook resources to separate charts

## [15.7.27-bb.2] - 2024-10-21

### Added

- Added pre-upgrade hook to automate upgrade process

## [15.7.27-bb.1] - 2024-10-10

### Upgraded

- Removed hardcoded minio matchLabels

## [15.7.27-bb.0] - 2024-10-03

### Upgraded

- Upgraded gluon from `0.5.3` -> `0.5.4`
- Upgraded minio-instance from `5.0.15-bb.2` -> `6.0.3-bb.2`

## [15.7.20-bb.1] - 2024-09-9

### Added

- Added Virtual Service for accessing Thanos MinIO Tenant

## [15.7.20-bb.0] - 2024-08-21

### Upgraded

- Upgraded Thanos from `v0.36.0` -> `v0.36.1`

## [15.7.17-bb.0] - 2024-08-05

### Upgraded

- Upgraded Thanos from `v0.35.1` -> `v0.36.0`

## [15.7.9-bb.6] - 2024-07-29

### Fixed

- Remove unnecessary `match` rule in VirtualService

## [15.7.9-bb.5] - 2024-07-19

### Changed

- Set retention to forever with values to set to 0s

## [15.7.9-bb.4] - 2024-07-05

### Removed

- Removed shared authPolicies set at the Istio level

## [15.7.9-bb.3] - 2024-07-01

### Fixed

- Remove references to deprecated common service account in values.yaml and README

## [15.7.9-bb.2] - 2024-07-01

### Fixed

- Add istio AuthorizationPolicy for compactor component to minio

## [15.7.9-bb.1] - 2024-06-24

### Fixed

- Point Istio Virtual Service to `query-frontend` pod
- Add additional authPols for virtual service change

## [15.7.9-bb.0] - 2024-06-18

### Upgraded

- Upgrade Thanos from `v0.34.1` -> `v0.35.1`

## [15.4.3-bb.1] - 2024-06-14

### Upgraded

- Checked for upstream diff and updated the DEVELOPMENT_MAINTENANCE.md to log the big bang-specific changes

## [15.4.3-bb.0] - 2024-05-16

### Upgraded

- Updated image `thanos` 0.34.1 -> 0.35.0 15.4.3-bb.0 for new chart version
- Updated chart `minio-instance` 5.0.11-bb.4 -> 5.0.12-bb.4 for new chart version
- Update gluon from 0.4.8 -> 0.5.0

## [13.2.2-bb.7] - 2024-05-15

### Added

- Added support for Istio Authorization Policies

## [13.2.2-bb.6] - 2024-05-14

### Fixed

- Fixed broken minIO subchart

## [13.2.2-bb.5] - 2024-05-14

### Added

- Added SSO/authservice integration

## [13.2.2-bb.4] - 2024-04-04

### Added

- Added additional network policies via values yaml

## [13.2.2-bb.3] - 2024-04-04

### Added

- Update minio securityContext

## [13.2.2-bb.2] - 2024-04-02

### Added

- Create `NetworkPolicy` for egress to external object stores

## [13.2.2-bb.1] - 2024-03-13

### Added

- Added Istio sidecar and serviceEntry resources for use with Istio whitelisting

## [13.2.2-bb.0] - 2024-02-22

### Upgraded

- Updated image `thanos` 0.34.0 -> 0.34.1 13.2.2-bb.0 for new chart version
- Updated chart `minio-instance` 5.0.10-bb.4 -> 5.0.11-bb.4 for new chart version

## [12.23.0-bb.2] - 2024-02-02

### Changed

- Updated gluon 0.4.8 for consumers to use custom scripts

## [12.23.0-bb.1] - 2024-02-01

### Changed

- Re-instated seLinuxOptions in SecurityContext fields

## [12.23.0-bb.0] - 2024-01-30

### Changed

- Updated chart version from 12.21.0 -> 12.23.0
- Updated Thanos from v0.33.0 -> v0.34.0

## [12.21.0-bb.1] - 2024-01-18

### Changed

- Fixed Thanos installation against Gatekeeper via SELinux options

## [12.21.0-bb.0] - 2024-01-17

### Changed

- Updated chart version to 12.21.0

## [12.16.1-bb.0] - 2023-12-06

### Changed

- Updated chart version to 12.16.1

## [12.13.12-bb.4] - 2023-12-01

### Added

- update securityContext for query, query-Frontend, and storageteway to fix kyverno policy violations

## [12.13.12-bb.3] - 2023-11-07

### Added

- Network Policy to egress to monitoring
- Initial dev documentation

### Changed

- ironbank/big-bang/base 2.0.0 -> 2.1.0

## [12.13.12-bb.2] - 2023-11-01

### Added

- Network Policy to allow grafana

## [12.13.12-bb.1] - 2023-10-26

### Added

- Network Policy to allow sidecar to connect to thanos.minio for tests
- Cypress tests when object storage is enabled

## [12.13.12-bb.0] - 2023-10-23

### Changed

- Changed minio dependency version
- Updated thanos from v0.32.4 -> v0.32.5
- Removed objstoreConfig values -- these will be set and passed through from the bigbang package

## [12.13.7-bb.2] - 2023-10-18

### Changed

- Changed cypress test to allow for retries waiting on prometheus
- Updated chart dependencies for common and minio-instance

## [12.13.7-bb.1] - 2023-10-12

### Added

- Added integration with prometheus thanos-sidecar

## [12.13.7-bb.0] - 2023-10-05

### Changed

- updated thanos from v0.32.3 -> v0.32.4
- updated helm chart version to 12.13.7

## [12.13.5-bb.1] - 2023-10-04

### Fixed

- generate readme to include values

## [12.13.5-bb.0] - 2023-10-01

### Changed

- updated thanos from v0.32.2 -> v0.32.3
- updated helm chart version to 12.13.5

## [12.13.3-bb.0] - 2023-09-20

### Changed

- updated thanos from v0.32.1 to v0.32.2
- updated helm chart version to 12.13.3

## [12.11.0-bb.10] - 2023-09-18

### Added

- egress test rules

## [12.11.0-bb.9] - 2023-08-31

### Changed

- updated thanos from v0.32.0 to v0.32.1

## [12.11.0-bb.8] - 2023-08-25

### Changed

- updated thanos from v0.29 to v0.32

## [12.11.0-bb.7] - 2023-08-22

### Added

- added renovate functionality to chart

## [12.11.0-bb.6] - 2023-08-21

### Added

- Initial Cypress tests

## [12.11.0-bb.5] - 2023-08-18

### Added

- Default ingress isio gateway labels added

## [12.11.0-bb.4] - 2023-08-18

### Added

- Allow ingress from istio gateway network policy added

## [12.11.0-bb.3] - 2023-08-16

### Changed

- Changed CHANGELOG.md to conform with syntax
- Changed volumePermissions image to use IronBank ironbank/big-bang/base:2.0.0

## [12.11.0-bb.2] - 2023-08-16

### Changed

- restore _common.tpl

## [12.11.0-bb.1] - 2023-08-16

### Added

- add initial resource limits for pods

## [12.11.0-bb.0] - 2023-08-10

### Changed

- updated helm repo to latest version

## [11.5.8-bb.3] - 2023-08-14

### Added

- added network policies

## [11.5.8-bb.2] - 2023-08-10

### Added

- added support for istio mtls and virtual service

## [11.5.8-bb.1] - 2022-12-07

### Added

- added minio sub-chart

## [11.5.8-bb.0] - 2022-11-09

### Added

- Added charts from upsteam charts
- Updated repo to registry one
