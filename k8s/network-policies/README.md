# Controlling traffic between pods

Kubernetes policies protect pods from internal network traffic. We can create simple Kubernetes network policies to isolate app microservices from each other within a namespace or across namespaces. Network policies are at namespace level.

## Isolate app services within a namespace

* By default all traffic is allowed. So we will lock it down, block all traffic first and then whitelist flows which are needed by the application.
* Default deny all ingress and all egress traffic. Create a “default” policy for a namespace which prevents all ingress and egress traffic by creating the following NetworkPolicy in that namespace.

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```
* Default allow all egress or ingress traffic
``` 
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all
spec:
  podSelector: {}
  egress:
  - {}
  policyTypes:
  - Egress
```

## Behavior of to and from selectors
There are four kinds of selectors

1. **podSelector**: This selects particular Pods in the same namespace as the NetworkPolicy which should be allowed as ingress sources or egress destinations.

1. **namespaceSelector**: This selects particular namespaces for which all Pods should be allowed as ingress sources or egress destinations.

1. **namespaceSelector and podSelector**: A single to/from entry that specifies both namespaceSelector and podSelector selects particular Pods within particular namespaces

1. **ipBlock**: This selects particular IP CIDR ranges to allow as ingress sources or egress destinations. These should be cluster-external IPs, since Pod IPs are ephemeral and unpredictable.

## Demo
* Create the network policy that allows service-b to get call called only from service-a and can call service-c on another namespace. Also, service-a should not receive any call.
`kubectl create -f NetworkPolicy.yaml`  
* Expose each pod inside cluster using clusterIp service.  
`kubectl expose pod/<service-b_name> --port=3010 -n dev`
* Now from shell of different sservices try to curl other services to test.
`kubectl get all -n dev`  
`kubectl get all -n dev`  
`kb -n dev exec -it <service-b_name> -- /bin/sh`  
`curl https://<service-a>:3000/appA`   
`curl https://<service-c>:3020/appC` 


