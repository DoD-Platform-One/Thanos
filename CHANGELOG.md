# Changelog

---
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
