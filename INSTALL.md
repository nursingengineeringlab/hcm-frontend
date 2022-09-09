# how to setup frontend in a local enviroment

### Install npm (Ubuntu Linux)

```
sudo apt-get install nodejs npm
```

### Install dependencies

```
npm install
```

### Make sure the config files urls, ips are correct

```
vim src/config.js
```

The content is like this:

```
module.exports = global.config = {
    //most of those port does not need to be changed.
    http_public_url: "http://nelab.ddns.umass.edu/backend/",
    mqtt_url: "ws://nelab.ddns.umass.edu" + ":" + "30848/mqtt",
    data_fetcher_http_url: "http://nelab.ddns.umass.edu/",
    dashboardHeaders: new Headers()
};
```

### Run frontend

```
npm start
```


# how to deploy on kubernetes


### make sure you commit and push the code to codebase

```
git add -A
git commit -m "some changes"
git push origin/main
```

### Docker build local image

```
docker build . -t nelab/hcm-frontend:latest
```

### Docker push to dockerhub

```
docker push nelab/hcm-frontend:latest
```

### Login to kubernetes cluster

```
ssh nelab.ddns.umass.edu

```

### delete existing pod 

```
kubectl get namespace

NAME              STATUS   AGE
kube-system       Active   186d
kube-public       Active   186d
kube-node-lease   Active   186d
default           Active   186d
monitoring        Active   186d
redis             Active   170d
emqx              Active   169d
postgresql        Active   169d
ingress           Active   166d
traefik-v2        Active   163d
ingress-nginx     Active   163d
app               Active   162d

kubectl ns app  (make sure you install kubectx and kubens plugin)

Context "microk8s" modified.
Active namespace is "app".

kubectl get pods

NAME                           READY   STATUS    RESTARTS       AGE
datafetcher-8568568764-58vcb   1/1     Running   10 (16d ago)   149d
api-64475d566b-bpd7t           1/1     Running   0              8d
frontend-7bf4878444-h8hlv      1/1     Running   0              8d


kubectl delete pod frontend-7bf4878444-h8hlv

```

### wait for pod recreate and then it will pull the latest image from docker hub

