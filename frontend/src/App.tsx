import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LeadScoring from './pages/LeadScoring';
import Proposals from './pages/Proposals';
import BattleCards from './pages/BattleCards';
import Conversations from './pages/Conversations';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leads" element={<LeadScoring />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/battle-cards" element={<BattleCards />} />
          <Route path="/conversations" element={<Conversations />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
