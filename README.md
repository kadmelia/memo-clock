# Memo'clock

Un memory quoi !

## Qu'est-ce donc ?

Le but du projet est de créer un mémory en JS et d'enregistrer les scores en
base de données via un backend PHP.

### Front

- Le front à été codé en JS (ES6) [voir les sources](front/src)
- Le style a été réalisé en SCSS [voir les sources](front/assets/styles.scss)
- Le JS est transpilé en ES2015, et le SCSS compilé, via Webpack [voir les sources](front/webpack.config.js).


### Back

Le back a été réalisé avec l'aide de Symfony 4 et du merveilleux
API-plateform.

- L'entité pour enregistrer les scores [voir les sources](back/src/Entity/Game.php)
- La migration pour cette entité [voir les sources](back/src/Migrations/Version20190826211621.php)

Et c'est tout ! API plateform s'occupe pour nous de générer l'API REST
et la gestion des requetes en fonction des verbes HTTP, et couplé à Doctrine, de gérer la persistance des données.

### Déploiment

Un  script de déploiement automatisé a été mis en place. [voir les sources](.gitlab-ci.yml).
Il permet de déclancher 2 pipelines sur Gitlab :

- Une qui va construire 2 containers docker contenant les sources compilées
    - Un container de front (nginx essentielement) [voir les sources](ci/deploy/dockerfiles/nginx/Dockerfile)
    - Un container de pour le back (php-fpm essentielement) [voir les sources](ci/deploy/dockerfiles/php/Dockerfile)
- Une qui va se connecter sur un serveur dédié en SSH pour
    - Y copier un fichier docker-compose [voir les sources](ci/deploy/docker-compose.yml)
    - Récupérer les containers construits sur Gitlab
    - Démarrer tous ce petit monde.

### Environement de developpement

Un environement de développement a été mis en place, basé sur docker compose [voir les sources](ci/compose/docker-compose.yml)

Il permet de simplement lancer les containers (nginx, php & mysql),
les sources vont être _montées_ dans ces derniers, et d'avoir un environement
prêt à l'emploi en quelques minutes sans rien installer sur sa machine.

## Limitation

### Sécu-quoi ?
La sécurité n'a pas du tout été gérée sur ce projet, tout est donc _open bar_, l'admin comme l'API.

