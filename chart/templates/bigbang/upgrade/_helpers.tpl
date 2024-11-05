{{- define "thanos.shouldDeployUpgradeResources" -}}
{{/* Define upgradeVersion inside the template so it's available when the template is used */}}
{{- $upgradeVersion := "15.7.27-bb.1" -}}
{{- if and .Release.IsUpgrade .Values.storegateway.enabled -}}
  {{- $statefulSet := lookup "apps/v1" "StatefulSet" .Release.Namespace "thanos-storegateway" -}}
  {{- if $statefulSet -}}
    {{- $currentVersion := dig "metadata" "labels" "helm.sh/chart" "<missing>" $statefulSet | trimPrefix "thanos-" -}}
    {{- if semverCompare (print "<" $upgradeVersion) $currentVersion -}}
true
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- end -}}