import { useNavigate } from 'react-router-dom';

function TabNav({ trainer, Disabled = false }) {
  const navigate = useNavigate();

  return (
    <div className="tab-buttons">
      <button
        disabled={Disabled}
        className="NavigationBtn"
        onClick={() => navigate(`/data/${trainer}`)}
      >
        Read Data Stream
      </button>

      <button
        disabled={Disabled}
        className="NavigationBtn"
        onClick={() => navigate(`/dtc/${trainer}`)}
      >
        Read Trouble Codes
      </button>

      <button
        disabled={Disabled}
        className="NavigationBtn"
        onClick={() => navigate(`/clear/${trainer}`)}
      >
        Clear Trouble Codes
      </button>
    </div>
  );
}

export default TabNav;
