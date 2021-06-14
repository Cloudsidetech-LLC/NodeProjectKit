# Node Project starter kit.

### Project description.

Project starter kit is framework/transport agnostic starter kit that allows to create simple, scalable and light project. Project core principe is to keep all infrastructure separated from business logic (DDD).

### Project construction.

Project separated on a two main parts:
* `/lib` This folder contains all infrastructure.
   * `/Errors` All error instances should be placed here. By default: `CustomError`.
   * `/helpers` Contains all helper functions for business logic support. Also contains logger interface.
   * `/listeners` Contains all requests handlers for a different transports. By default: `http` and `static` servers.
   * `/repository` Database access layer functionality separated by tables/collections.
   * `dbConnect.js` Database connection file. Can be wrapped to Class/Factory to provide connections pool.
 
* `/app` This folder contains all business logic. By default contains following functionality.
   * `/middlewares` Contains all requests middlewares. AutoRequire: On.
   * `/models` Database models (entity).
   * `/routes` Files to describe requests handlers. All `http` rotes constructed based on `/routes` files relative paths. Ex: We have file `signIn.js` in `/routes/auth` folder. That means that handler in `signIn.js` file will work for `/auth/signIn` route. AutoRequire: On.  
   * `/services` Business logic functionality.

Rest folders:
* `/config` Contains config hash table as a JavaScript file.
* `/constants` Contains all project constants. AutoRequire: On. Will be placed in `global`.
* `/static` Static files directory.

### Dependencies