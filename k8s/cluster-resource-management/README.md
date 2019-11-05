# Cluster Resource Management
In this scenario, we want to connstrain pods from requesting more than x amount of CPU and memory and limit them to a max for each.  We will focus on service-a in the org-1 namespace.

## Deploy service-a with no limits

1. kubectl delete po service-a -n org-1
1. kubectl delete limitrange limit-mem-cpu-per-container -n org-1
1. kubectl apply -f ./no-limit-pod.yml -n org-1
1. kubectl describe po service-a -n org-1
1. Note that the service should be scheduled without issue

## Ops applies limits to namespace

1. kubectl apply -f ./limit-range.yml -n org-1
1. Check limits. kubectl describe limitrange limit-mem-cpu-per-container -n org-1

## Deploy with limit range in place

1. kubectl delete po service-a -n org-1
1. kubectl apply -f ./no-limit-pod.yml -n org-1
1. Not that you cannot schedule the pod

```
Chriss-MacBook-Pro-2:cluster-resource-management chris$ kubectl apply -f ./no-limit-pod.yml -n org-1
ingress.networking.k8s.io/test-ingress unchanged
service/service-a unchanged
The Pod "service-a" is invalid: spec.containers[0].resources.requests: Invalid value: "2G": must be less than or equal to memory limit
```

## Fix memory request to be within limits

1. kubectl apply -f ./adjusted-pod-resources.yml -n org-1
```
Chriss-MacBook-Pro-2:cluster-resource-management chris$ kubectl apply -f ./adjusted-pod-resources.yml -n org-1
ingress.networking.k8s.io/test-ingress unchanged
service/service-a unchanged
pod/service-a created
```

# Ops add resource quotas on node port and load balancers

1. kubectl delete po service-a-node-port -n org-1
1. kubectl apply -f ./cluster-resource-management/quota.yml -n org-1
1. kubectl apply -f ./cluster-resource-management/node-port.yml -n org-1

```
Chriss-MacBook-Pro-2:k8s chris$ kubectl apply -f ./cluster-resource-management/node-port.yml -n org-1
Error from server (Forbidden): error when creating "./cluster-resource-management/node-port.yml": services "service-a" is forbidden: exceeded quota: resource-quota, requested: services.nodeports=1, used: services.nodeports=0, limited: services.nodeports=0
```
