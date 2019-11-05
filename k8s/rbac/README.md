# Ops would like to provide a namespace for each team to deploy their product/project's services.  

##  Create namespace and service account for team dev
`kubectl create namespace dev`  
`kb label namespace dev user=dev`  
`kubectl create serviceaccount dev -n dev`  
* It will create secrets for service account dev automatically. To view secret  
` kubectl get secrets -n dev`

##  Create namespace and service account for team qa
`kubectl create namespace qa`   
`kb label namespace qa user=qa`  
`kubectl create serviceaccount qa -n qa`  

* Add secrets to pull image from registry to each namespace
`kubectl get secret default-us-icr-io -o yaml | sed 's/default/<new-namespace>/g' | kubectl -n <new-namespace> create -f -`

* To change context to particular namespace  
`kubectl config set-context --current --namespace=qa`  

* To see the current context - current user login  
`kubectl config view`  

## Create cluster role and rolebindings for each service account.  
* To get all the roles and rolebindings for namespace  
`kubectl describe rolebinding.rbac -n dev`  
`kubectl describe role.rbac -n dev`   

* Create the cluster role to allow teams to create deployments, secrets and config map  
`kubectl apply -f ./ClusterRole.yaml`

* Assign this role to service accounts using rolebindings for thier respective namespaces.  
`kubectl apply -f ./RoleBindings.yaml`

## Login to kubernetes cluster using any one of service account
* `kubectl --as=system:serviceaccount:dev:dev -n dev`   


* Get the service account token using following commands  
`kubectl get secret --namespace={namespace}`  
`kubectl get secret default-token-2mfqv --namespace={namespace} -o yaml`   

* The token part in the output is base64 encoded. Decode token and create as new user in config.    
`kubectl config set-credentials dev-users --token=$(kubectl get secret <secret_name> --namespace={namespace} -o jsonpath={.data.token} | base64 -D)`  

* Create new context with this service account and same cluster.  
`kubectl config set-context dev-context --user=dev-users --cluster={cluster_name}`  

* Point to new context   
`kubectl config use-context dev-context `   

## Deploy application using dev service account to namespace dev.
`kubectl apply -f ./Deployment-appA.yaml -n dev`  
`kubectl apply -f ./Deployment-appB.yaml -n dev`  

* Now try to get or create pods, deployment in different namespaces. Except dev, it will throw forbidden exception as this SA doesnt have access to other namesspace.   

* Also try to create new rolebinding it will throw forbidden exception as this SA doent have permission.   

## Deploy application using qa service account to namespace qa.  
`kubectl apply -f ./Deployment-appC.yaml -n qa`









