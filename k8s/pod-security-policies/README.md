# Pod security policies

* Kubernetes pod security policies are a cluster-level resource, not individual pods 
* PodSecurityPolicies are enforced by enabling the admission controller
* It can be enabled by adding --enable-admission-plugins=PodSecurityPolicy,... to kube-apiserver configuration file, for example /etc/kubernetes/manifest/kube-apiserver.yaml
* Kubernetes pods can be directly created directly by users or they are created indirectly as part of a Deployment, ReplicaSet, or other templated controller via the controller manager. So the preferred method for authorizing policies is to grant access to the pod’s service account. 
* When a PodSecurityPolicy resource is created, it does nothing. In order to use it, the requesting user or target pod’s service account must be authorized to use the policy, by allowing the use verb on the policy.
* Authorization of user or service account to use policy is done via RBAC. i.e Role or ClusterRole needs to grant access to use the desired policies. 
* By default, IBM cloud cluster contains the following RBAC resources that enable cluster administrators, authenticated users, service accounts, and nodes to use the **ibm-privileged-psp** and **ibm-restricted-psp** pod security policies. These policies allow the users to create and update privileged and unprivileged (restricted) pods.

### Policy Order
* In addition to restricting pod creation and update, pod security policies can also be used to provide default values for many of the fields that it controls. 
* When multiple policies are available, the pod security policy controller selects policies according to the following criteria:

   1. PodSecurityPolicies which allow the pod as-is, without changing defaults or mutating the pod, are preferred. 
      The order of these non-mutating PodSecurityPolicies doesn’t matter.
   1. If the pod must be defaulted or mutated, the first PodSecurityPolicy (ordered by name) to allow the pod is 
      selected.

### Demo
In this demo we will see how default IBM pod security policies allow to run container as privileged. We will unauthorize the existing policies from service accounts and see without any psp not able to create pod. Finally, will create new pod security policy to restrict privilege and authorize by creating new cluster role and clusterbinding to service account.

* To see existing policies  
`kubectl get psp`

* Unauthorize privilege polices for all service accounts   
`kubectl edit clusterrolebinding privileged-psp-user`   
 Remove serviceaccounts and authenticated users.   

* Try to create pod without privilege psp.  
` kubectl create -f POD.yaml  --as=system:serviceaccount:org-1:org-1-service-account -n org-1`   
It will throw forbidden: error.   

* Now add the psp and authorize the policy using rolebinding.  
`kb create -f PSP.yaml`  
`kb create -f ClusterRole.yaml`   
`kb create -f ClusterRoleBinding.yaml` 

* Try to create pod as privilege container using service account org-1 in org-1 namespace.  
` kubectl create -f POD.yaml  --as=system:serviceaccount:org-1:org-1-service-account -n org-1`   
It will throw forbidden again, as against policy.

* Try to create pod without privilege container using service account org-1 in org-1 namespace.
  Modilfy pod and run `kubectl apply -f ./POD.yaml --as=system:serviceaccount:org-1:org-1-service-account -n org-1`
  Pod created successful

* Restore orignial psp.
`kubectl edit clusterrolebinding privileged-psp-user`   
```
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:serviceaccounts
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:authenticated
```

* For reference: https://kubernetes.io/docs/concepts/policy/pod-security-policy/


