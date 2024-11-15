import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AppRoutes } from './routes';


function App() {
  return (
    <Router>
      
        <AppRoutes />
      
    </Router>
  );
}

export default App;