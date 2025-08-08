import { registerRootComponent } from expo;
// Point to your real App component for Android. Adjust path if needed:
const App = require('./apps/mobile/src/App').default;
registerRootComponent(App);
