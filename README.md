# cascon-2019-Kubernetes-security

# Setup

1. Have a Kubernetes (k8s) cluster created.  For example, you could get a free trial at https://www.ibm.com/cloud/container-service or just use a local Docker for Mac or minikube instance.
1. Create two namespaces - org-1 and org-2
1. [Build and push service](https://github.com/cloud-coder/cascon-2019-k8s-security/tree/master/k8s/image-and-pod-security#build-and-push-all-services-in-topology) images that will be used for the majority of the talk. NOTE: You can use any Docker registry (e.g. Dockerhub).  The examples below use [IBM Container Registry](https://www.ibm.com/cloud/container-registry)

# Examples
1. [Image and pod security](./k8s/image-and-pod-security)
1. [RBAC](./k8s/rbac)
1. [Pod Security Policies](./k8s/pod-security-policies)
1. [Resource Management](./k8s/cluster-resource-management)
1. [Network Policies](./k8s/network-policies)
1. [Secrets](./k8s/Secrets)

