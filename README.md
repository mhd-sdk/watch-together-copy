# GoReactWatchTogether

Ce projet est une plateforme inspirée de Watch Together, permettant aux utilisateurs de regarder des vidéos synchronisément avec leurs amis en temps réel. Le backend est développé en Go, tandis que le frontend utilise React avec TypeScript.

## Prérequis

### Avec docker

Un environnement docker est disponible si vous ne souhaitez pas installer les dépendances manuellement. Pour lancer le projet avec docker, lancez la commande suivante :

```bash
docker-compose up
```

### Sans docker

Avant de lancer le projet, assurez-vous d'avoir installé :

- Go (version recommandée : 1.21.4)
- Node.js (version recommandée : 1.20.x ou plus)
- pnpm (ne pas utiliser npm ou yarn)

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/mhd-sdk/watch-together-copy.git
```

2. Installez les dépendances du backend :

```bash
go mod download
```

3. Installez les dépendances du frontend :

```bash
pnpm install
```

## Lancement

```bash
go run main.go
```

```bash
pnpm dev
```




