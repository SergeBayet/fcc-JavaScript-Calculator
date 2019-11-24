import React from "react";

import logo from "./logo.svg";
import "./App.css";

const isOperator = /[x/+-]/,
  endsWithOperator = /[x+-/]$/,
  endsWithNegativeSign = /[x/+]-$/;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: ""
    };
    this.maxDigitWarning = () => {
      this.setState({
        currentVal: "Digit Limit Met",
        prevVal: this.state.currentVal
      });
      setTimeout(() => this.setState({ currentVal: this.state.prevVal }), 1000);
    };
    this.handleNumbers = e => {
      if (!this.state.currentVal.includes("Limit")) {
        const { currentVal, formula, evaluated } = this.state;
        const value = e.target.value;
        this.setState({ evaluated: false });
        if (currentVal.length > 21) {
          this.maxDigitWarning();
        } else if (evaluated) {
          this.setState({
            currentVal: value,
            formula: value !== "0" ? value : ""
          });
        } else {
          this.setState({
            currentVal:
              currentVal === "0" || isOperator.test(currentVal)
                ? value
                : currentVal + value,
            formula:
              currentVal === "0" && value === "0"
                ? formula
                : /([^.0-9]0)$/.test(formula)
                ? formula.slice(0, -1) + value
                : formula + value
          });
        }
      }
      this.handleOperators = e => {
        if (!this.state.currentVal.includes("Limit")) {
          const value = e.target.value;
          const { formula, prevVal, evaluated } = this.state;
          this.setState({ currentVal: value, evaluated: false });
          if (evaluated) {
            this.setState({ formula: prevVal + value });
          } else if (!endsWithOperator.test(formula)) {
            this.setState({
              prevVal: formula,
              formula: formula + value
            });
          } else if (!endsWithNegativeSign.test(formula)) {
            console.log("ends with minus : " + formula + value);
            console.log(endsWithNegativeSign.test(formula + value));
            this.setState({
              formula:
                (endsWithNegativeSign.test(formula + value)
                  ? formula
                  : prevVal) + value
            });
          } else if (value !== "‑") {
            this.setState({
              formula: prevVal + value
            });
          }
        }
      };
      this.handleEvaluate = () => {
        if (!this.state.currentVal.includes("Limit")) {
          let expression = this.state.formula;
          while (endsWithOperator.test(expression)) {
            expression = expression.slice(0, -1);
          }
          expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
          let answer =
            // eslint-disable-next-line no-eval
            Math.round(1000000000000 * eval(expression)) / 1000000000000;
          this.setState({
            currentVal: answer.toString(),
            formula:
              expression.replace(/\*/g, "⋅").replace(/-/g, "‑") + "=" + answer,
            prevVal: answer,
            evaluated: true
          });
        }
      };
      this.handleDecimal = () => {
        if (this.state.evaluated === true) {
          this.setState({
            currentVal: "0.",
            formula: "0.",
            evaluated: false
          });
        } else if (
          !this.state.currentVal.includes(".") &&
          !this.state.currentVal.includes("Limit")
        ) {
          this.setState({ evaluated: false });
          if (this.state.currentVal.length > 21) {
            this.maxDigitWarning();
          } else if (
            endsWithOperator.test(this.state.formula) ||
            (this.state.currentVal === "0" && this.state.formula === "")
          ) {
            this.setState({
              currentVal: "0.",
              formula: this.state.formula + "0."
            });
          } else {
            this.setState({
              currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
              formula: this.state.formula + "."
            });
          }
        }
      };
      this.initialize = () => {
        this.setState({
          currentVal: "0",
          prevVal: "0",
          formula: "",
          currentSign: "pos",
          lastClicked: "",
          evaluated: false
        });
      };
    };
  }
  render() {
    return (
      <div className="App">
        <div className="calculator">
          <Formula formula={this.state.formula.replace(/x/g, "⋅")} />
          <Output currentValue={this.state.currentVal} />
          <Buttons
            decimal={this.handleDecimal}
            evaluate={this.handleEvaluate}
            initialize={this.initialize}
            numbers={this.handleNumbers}
            operators={this.handleOperators}
          />
        </div>

        <Footer />
      </div>
    );
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div>
        <button id="seven" value="7" onClick={this.props.numbers}>
          7
        </button>
        <button id="eight" value="8" onClick={this.props.numbers}>
          8
        </button>
        <button id="nine" value="9" onClick={this.props.numbers}>
          9
        </button>
        <button id="divide" value="/" onClick={this.props.operators}>
          /
        </button>
        <button id="back" value="<" onClick={this.props.back}>
          &lt;
        </button>
        <button
          id="clear"
          onClick={this.props.initialize}
          style={{ background: "red" }}
          value="AC"
        >
          AC
        </button>
        <button id="four" value="4" onClick={this.props.numbers}>
          4
        </button>
        <button id="five" value="5" onClick={this.props.numbers}>
          5
        </button>
        <button id="six" value="6" onClick={this.props.numbers}>
          6
        </button>
        <button id="multiply" value="x" onClick={this.props.operators}>
          x
        </button>
        <button value="(">(</button>
        <button value=")">)</button>
        <button id="one" value="1" onClick={this.props.numbers}>
          1
        </button>
        <button id="two" value="2" onClick={this.props.numbers}>
          2
        </button>
        <button id="three" value="3" onClick={this.props.numbers}>
          3
        </button>
        <button id="subtract" value="-" onClick={this.props.operators}>
          -
        </button>
        <button id="square" value="x²" onClick={this.props.operators}>
          x²
        </button>
        <button id="rootsquare" onClick={this.props.operators} value="v">
          v
        </button>
        <button id="zero" value="0" onClick={this.props.numbers}>
          0
        </button>
        <button id="decimal" value="." onClick={this.props.decimal}>
          .
        </button>
        <button id="percent" value="%" onClick={this.props.percent}>
          %
        </button>
        <button id="add" value="+" onClick={this.props.operators}>
          +
        </button>
        <button
          className="jumbo"
          id="equals"
          value="="
          onClick={this.props.evaluate}
        >
          =
        </button>
      </div>
    );
  }
}

class Formula extends React.Component {
  render() {
    return <div className="formulaScreen">{this.props.formula}</div>;
  }
}

class Output extends React.Component {
  render() {
    return (
      <div className="outputScreen" id="display">
        {this.props.currentValue}
      </div>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <footer className="author">
        {" "}
        Designed and Coded By <br />
        <a
          href="https://sergebayet.github.io/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Serge Bayet
        </a>
      </footer>
    );
  }
}

export default App;
