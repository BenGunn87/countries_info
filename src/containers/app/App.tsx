import React from 'react';
import './App.css';
import {IAppProps} from "./App.type.";
import {Country} from "../Country/Country";

class App extends React.Component<IAppProps> {
  public constructor(props: IAppProps) {
    super(props);
  }

  public render = () => {
    return <main className="main-container">
      <Country/>
    </main>
  };
}

export default App;
