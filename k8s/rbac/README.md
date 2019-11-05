# Ops would like to provide a namespace for each organization to deploy their product/project's services.  

By default, new service account doesn't have access to anything except 'get' on discovery like version, health etc. In this demo, we are going to provide access to new service accounts to create, get and list deployment, replica controller, secrets and pods. 

First we will se service account doent have access to anything and then grant access by creating clusterroles and rolebindings. At last, we will see how we can restrict `delete` access by modifying clusterrole.


##  Create service account for organizations org-1 and org-2
`kubectl create serviceaccount org-1-service-account -n org-1`   
`kubectl create serviceaccount org-2-service-account -n org-2`  

* It will create secrets for service account automatically. To view secret  
` kubectl get secrets -n org-1`  
` kubectl get secrets -n org-2`   

* Add secrets to pull image from registry to each namespace
`kubectl get secret default-us-icr-io -o yaml | sed 's/default/<new-namespace>/g' | kubectl -n <new-namespace> create -f -`
 
## Login to kubernetes cluster using any one of service account

We have two options to login through particular service account, via --as command or editing kube-config file.  

* `kubectl --as=system:serviceaccount:org-1:org-1-service-account -n org-1`   

* Get the service account token using following commands  
`kubectl get secret --namespace={namespace}`  
`kubectl get secret default-token-2mfqv --namespace={namespace} -o yaml`   

* The token part in the output is base64 encoded. Decode token and create as new user in config.    
`kubectl config set-credentials org-1-users --token=$(kubectl get secret <secret_name> --namespace={namespace} -o jsonpath={.data.token} | base64 -D)`  

* Create new context with this service account and same cluster.  
`kubectl config set-context org-1-context --user=org-1-users --cluster={cluster_name}`  

* Point to new context   
`kubectl config use-context org-1-context `  

## Verify that new service account doesn't have access to create anything
`kubectl get pods -n org-1 --as=system:serviceaccount:org-1:org-1-service-account`   
`kubectl create -f ./Deployment-service-a.yaml -n org-1 --as=system:serviceaccount:org-1:org-1-service-account`   

## Create cluster role and rolebindings for each service account.  
* To get all the roles and rolebindings for namespace  
`kubectl describe rolebinding.rbac -n org-1`  
`kubectl describe role.rbac -n org-1`   

* Create the cluster role to allow teams to create, get deployments, pods, secrets and configmap  
`kubectl apply -f ./ClusterRole.yaml`

* Assign this role to service accounts using rolebindings for thier respective namespaces.  
`kubectl apply -f ./RoleBindings.yaml`

## Verify that org-1 service account can get on resources in namespace org-1 and not in org-2 and viceversa.
`kb get pods -n org-1 --as=system:serviceaccount:org-1:org-1-service-account`   
`kb get pods -n org-2 --as=system:serviceaccount:org-2:org-2-service-account`   
`kb get pods -n org-1 --as=system:serviceaccount:org-2:org-2-service-account`   
`kb get pods -n org-2 --as=system:serviceaccount:org-1:org-1-service-account`   

## Deploy applications using org-1 service account to namespace org-1.
`kubectl apply -f ./Deployment-service-a.yaml -n org-1 --as=system:serviceaccount:org-1:org-1-service-account`  
`kubectl apply -f ./Deployment-service-b.yaml -n org-1 --as=system:serviceaccount:org-1:org-1-service-account`  

## Deploy application using org-2 service account to namespace org-2.
`kubectl apply -f ./Deployment-service-c.yaml -n org-2 --as=system:serviceaccount:org-2:org-2-service-account`  

## Verify Service account can delete the deployment.
`kubectl delete deployment service-b -n org-1 --as=system:serviceaccount:org-1:org-1-service-account`

## Modify cluster role to restrict delete.
`kb edit clusterrole kb-security` and remove 'delete from verbs'.
* Try deleting again, forbidden error.

## ReDeploy service-b.
`kubectl apply -f ./Deployment-service-b.yaml -n org-1 --as=system:serviceaccount:org-1:org-1-service-account`  
