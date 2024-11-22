import { DBBrand, DBHeader, DBPage, DBSection } from "@db-ui/react-components";
import Migration from "./pages/migration";
import "./index.css";

const App = () => {
  return (
    <DBPage
      variant="fixed"
      header={<DBHeader brand={<DBBrand>DBHeader</DBBrand>}></DBHeader>}
    >
      <DBSection spacing="none">
        <Migration />
      </DBSection>
    </DBPage>
  );
};

export default App;
