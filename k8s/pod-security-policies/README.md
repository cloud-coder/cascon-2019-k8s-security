# Pod security policies

* Kubernetes pod security policies are a cluster-level resource, not individual pods 
* PodSecurityPolicies are enforced by enabling the admission controller
* It can be enabled by adding --enable-admission-plugins=PodSecurityPolicy,... to kube-apiserver configuration file, for example /etc/kubernetes/manifest/kube-apiserver.yaml
* Kubernetes pods can be directly created directly by users or they are created indirectly as part of a Deployment, ReplicaSet, or other templated controller via the controller manager. So the preferred method for authorizing policies is to grant access to the pod’s service account. 
* When a PodSecurityPolicy resource is created, it does nothing. In order to use it, the requesting user or target pod’s service account must be authorized to use the policy, by allowing the use verb on the policy.
* Authorization of user or service account to use policy is done via RBAC. i.e Role or ClusterRole needs to grant access to use the desired policies. 
* By default, IBM cloud cluster contains the following RBAC resources that enable cluster administrators, authenticated users, service accounts, and nodes to use the ibm-privileged-psp and ibm-restricted-psp pod security policies. These policies allow the users to create and update privileged and unprivileged (restricted) pods.

### Policy Order
* In addition to restricting pod creation and update, pod security policies can also be used to provide default values for many of the fields that it controls. 
* When multiple policies are available, the pod security policy controller selects policies according to the following criteria:

   1. PodSecurityPolicies which allow the pod as-is, without changing defaults or mutating the pod, are preferred. 
      The order of these non-mutating PodSecurityPolicies doesn’t matter.
   1. If the pod must be defaulted or mutated, the first PodSecurityPolicy (ordered by name) to allow the pod is 
      selected.
### Demo

* To see existing policies  
`kubectl get psp`

* Remove existing polices for all service accounts  
`kubectl get clusterrolebinding privileged-psp-user -o yaml > privileged-psp-user.yaml`  
`kubectl apply -f privileged-psp-user.yaml`

* Try to create pod as privilege user using service account dev in dev namespace.  
` kubectl create -f POD.yaml  --as=system:serviceaccount:dev:dev -n dev`

* Now add the psp and authorize the policy using rolebinding.  
`kb create -f PSP.yaml`  
`kb create -f ClusterRole.yaml`   
`kb create -f ClusterRoleBinding.yaml`   

* For reference: https://kubernetes.io/docs/concepts/policy/pod-security-policy/
