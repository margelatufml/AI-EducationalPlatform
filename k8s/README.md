# Intelecta Kubernetes Deployment

## Prerequisites
- Kubernetes cluster (minikube, kind, or cloud)
- kubectl configured
- Docker (for building images)
- (Optional) NGINX Ingress Controller installed

## 1. Build Docker Images

From the project root:

```
# Backend
cd BackEnd/intelectabackend
# Build JAR if needed, then:
docker build -t intelectabackend:latest .

# Frontend
cd ../../../FrontEnd/IntelectaFrontEndOriginal
# Build static files if needed, then:
docker build -t intelectafrontend:latest .
```

## 2. Load Images into Cluster (if using minikube/kind)

```
# For minikube:
minikube image load intelectabackend:latest
minikube image load intelectafrontend:latest
```

## 3. Deploy MySQL

```
kubectl apply -f k8s/mysql-pvc.yaml
kubectl apply -f k8s/mysql-service.yaml
kubectl apply -f k8s/mysql-statefulset.yaml
```

## 4. Deploy Backend & Frontend

```
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

## 5. Deploy Ingress (Optional)

```
kubectl apply -f k8s/ingress.yaml
```

- Update your /etc/hosts: `127.0.0.1 intelecta.local`
- Make sure NGINX Ingress Controller is running.

## 6. Access the App
- Frontend: http://intelecta.local/ (via Ingress) or http://localhost:30080/ (NodePort)
- Backend API: http://intelecta.local/api/ (via Ingress)

---

**Note:**
- Update image names/tags as needed for your registry.
- Adjust environment variables for production security. 