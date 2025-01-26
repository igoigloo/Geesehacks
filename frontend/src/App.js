import MapComponent from "./components/mapComponent";
import SidebarComponent from "./components/sidebareComponent";

const accidentData = [
  { id: 1, lng: -79.3832, lat: 43.6532, description: "Accident at Main St." },
  { id: 2, lng: -79.3872, lat: 43.6572, description: "Collision near Dundas." },
];

function App() {
  return (
    <div style={{ display: "flex" }}>
      <SidebarComponent data={accidentData} />
      <MapComponent />
    </div>
  );
}

export default App;
