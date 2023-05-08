> This is an alpha version , which means it is still in early development and may contain bugs or incomplete features. Use at your own risk.

## How to use dauth-provider 

Dauth-provider provides react modal UI toolkits for integrating dauth into your website.

## example

```typescript
import "@dauth/dauth-provider/dist/style.css";
import "@dauth/dauth-provider/dist/tailwind.css";
import { useSignModal, Button } from "@dauth/dauth-provider";

function App() {
  const { Modal: SignModal, showModal: showSignModal } = useSignModal();
  const handleSuccess = (token: string) => {
    // token is JWT token
    console.log(token)
    // TODO: handle token
    // And you can find more information about JWT in https://app.gitbook.com/o/STgvl98TJZ4EXC3dYgGB/s/5k83JZlV6lz01m7DmSkh/~/changes/26/developers/api-guide
    // You can verify token with https://jwt.io/libraries. 
  }
  return (
    <div className="App">
      <SignModal onSuccess={handleSuccess} />
      <Button onClick={showSignModal} className="w-64">
        login with dauth
      </Button>
    </div>
  );

}

export default App;


```
You can find more code excample in `apps/demo/src/App.tsx`