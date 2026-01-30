{{- define "thanos.shouldDeployUpgradeResources" -}}
{{/* Define upgradeVersion inside the template so it's available when the template is used */}}
{{- $upgradeVersion := "15.8.1-bb.0" -}}
{{- if and .Release.IsUpgrade .Values.storegateway.enabled -}}
  {{- $statefulSet := lookup "apps/v1" "StatefulSet" .Release.Namespace "thanos-storegateway" -}}
  {{- if $statefulSet -}}
    {{- $currentVersion := dig "metadata" "labels" "helm.sh/chart" "<missing>" $statefulSet | trimPrefix "thanos-" | replace "_" "+" -}}
    {{- if semverCompare (print "<" $upgradeVersion) $currentVersion -}}
true
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- end -}}