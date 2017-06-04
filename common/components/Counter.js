import React from 'react'
import PropTypes from 'prop-types'

let aaa = 0

class Counter extends React.Component {
  constructor(props) {
    super(arguments)
    console.log('constructor', aaa++)
    props.increment()
  }
  componentDidMount() {
    console.log('cdm')
  }
  render() {
    const {increment, incrementIfOdd, incrementAsync, decrement, counter} = this.props
    // console.log(1)
    return (
      <p>
    Clicked: {counter} times
    {' '}
    <button onClick={increment}>+</button>
    {' '}
    <button onClick={decrement}>-</button>
    {' '}
    <button onClick={incrementIfOdd}>Increment if odd</button>
    {' '}
    <button onClick={() => incrementAsync()}>Increment async</button>
  </p>
    )
  }
}

/*export default Counter

const Counter = ({increment, incrementIfOdd, incrementAsync, decrement, counter}) => (
  <p>
    Clicked: {counter} times
    {' '}
    <button onClick={increment}>+</button>
    {' '}
    <button onClick={decrement}>-</button>
    {' '}
    <button onClick={incrementIfOdd}>Increment if odd</button>
    {' '}
    <button onClick={() => incrementAsync()}>Increment async</button>
  </p>
)*/

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired
}

export default Counter
