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
In this demo,  we will see first that all services can call every other service. Then will implement the network policy that allows traffic from service-a to service-b only, not viceversa. Also isolate service-c in namespace org-2.


* Make sure all three pods are running.

* Expose each pod inside cluster using clusterIp service.  
`kubectl expose pod/<service-b_podname> --port=3000 -n org-1`

* Now from shell of different services try to curl other services and validate that you are able to call successfully.   
`kubectl get all -n org-1`  
`kubectl get all -n org-2`  
`kubectl -n org-1 exec -it <service-b_podname> -- /bin/sh`  
`curl https://<service-a>:3000`   
`curl https://<service-c>:3000` 

* Create the network policy that allows service-b to get call called only from service-a and pods in one namespace wont be able to call pods in another namespace.     
`kubectl create -f NetworkPolicy.yaml`  

* Now from shell of different services try to curl other services to test.    
`kubectl get all -n org-1`  
`kubectl get all -n org-2`  
`kubectl -n org-1 exec -it <service-b_podname> -- /bin/sh`  
`curl https://<service-a>:3000`   
`curl https://<service-c>:3000` 


