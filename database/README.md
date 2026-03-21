## Database Design

### Target Database
- MySQL 8.0

### Logical Data Model

- User
    - id (PK)
    - username (unique)
    - password
    - email (unique)
    - created_at
    - updated_at
    - is_active

- Role
    - id (PK)
    - name
    - created_at
    - updated_at

- User_Role
    - user_id (PK, FK to User.id)
    - role_id (PK, FK to Role.id)
    - created_at
    - updated_at

