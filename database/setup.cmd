podman pull docker.io/library/mysql:8.0
podman volume create gemrealty-db-data
podman run -d --name gemrealty-db -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -v gemrealty-db-data:/var/lib/mysql mysql:8.0

podman exec -i gemrealty-db mysql -u root --password=root -e "CREATE DATABASE IF NOT EXISTS gemrealty;"
podman exec -i gemrealty-db mysql -u root --password=root gemrealty < user.sql
podman exec -i gemrealty-db mysql -u root --password=root gemrealty < role.sql
podman exec -i gemrealty-db mysql -u root --password=root gemrealty < user_role.sql

podman exec -i gemrealty-db mysql -u root --password=root gemrealty -e "INSERT INTO users (username, password, email) VALUES ('test', 'test1234', 'test@test.com');"
podman exec -i gemrealty-db mysql -u root --password=root gemrealty -e "INSERT INTO users (username, password, email) VALUES ('admin', 'admin1234', 'admin@test.com');"
podman exec -i gemrealty-db mysql -u root --password=root gemrealty -e "INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);"
podman exec -i gemrealty-db mysql -u root --password=root gemrealty -e "INSERT INTO user_roles (user_id, role_id) VALUES (3, 3);"