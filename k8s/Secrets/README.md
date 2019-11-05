# Kubernetes Secrets
* Kubernetes secret objects let you store and manage sensitive information, such as passwords, tokens, and ssh keys.
* Kubernetes automatically creates secrets when creating service account to access the API and it automatically modifies your pods to use this type of secret.
* A secret can be  used by kubelet when pulling images for the pod.
* A secret can be used with a pod in two ways: as files in a volume mounted on one or more of its containers or as env variables.

## Creating your own Secrets
* Using Kubectl `kubectl create secret generic db-user --from-file=./username.txt --from-file=./password.txt`
* Using yaml file `Kubectl create -f Secret.yaml`.  
* stringData field put a non-base64 encoded string directly into the Secret, and the string will be encoded for you when the Secret is created or updated. Data stores as values as string.

### Decoding a Secret  
`echo 'MWYyZDFlMmU2N2Rm' | base64 --decode`  

## Using Secrets as Environment Variables
`kubectl create -f Pod-env.yaml`  
`kb exec -it secret-env -- /bin/sh`  
`echo '$SECRET_PASSWORD'`  
* Change the secret values  
`kubectl apply -f Secret.yaml`
* Except no change without deleting the pod and creating new.

## Using Secrets as Files from a Pod
* Inside the container that mounts a secret volume, the secret keys appear as files and the secret values are base-64 decoded and stored inside these files.  
* Mounted Secrets are updated automatically   
`kubectl create -f Pod-vol.yaml`  
`kb exec -it secret-vol -- /bin/sh`   
`cd /etc/mysecret`  
`ls`  
`cat username; echo; cat password; echo`  
* Change the secret values  
`kubectl apply -f Secret.yaml`  
* New value of secret will reflect.  

## Projection of secret keys to specific paths
```
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```
## RBAC to create and delete only secrets.  
* Update the CLusterRole to diable get, list and watch on secrets.   
`kubectl apply -f ClusterRole.yaml`

## Encrypting the secrets
* By default, the identity provider is used to protect secrets in etcd, which provides no encryption. 
* EncryptionConfiguration uses providers like aescbc, secretbox etc to encrypt secrets locally, with a locally managed key. 
* Generate a 32-byte random key and encode it in base64.   
`head -c 32 /dev/urandom | base64`
* On all master nodes, set the --experimental-encryption-provider-config on the kube-apiserver to point to the location of the configuration file.
* Encrypting secrets with a locally managed key protects against an etcd compromise, but it fails to protect against a host compromise.
* So here comes the Envelope encryption which creates dependence on a separate key, not stored in Kubernetes. One such provider is KMS.
* Reference https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/
