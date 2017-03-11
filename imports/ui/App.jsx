import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterButton: 'Hide Completed'
    };
  }

  toggleHideCompleted() {
    this.setState({
      filterButton: this.state.filterButton==='Hide Completed'? 'Show All': 'Hide Completed'
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tasks.insert', text);

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.filterButton === 'Show All') {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render(){
    return (
      <div className="container">
        <header>
          <h1>ToDo List ({this.props.incompleteCount})</h1>

        <button className="hide-completed clickable" onClick={this.toggleHideCompleted.bind(this)}>
          {this.state.filterButton} Tasks
        </button>

        <AccountsUIWrapper />
        </header>

        { this.props.currentUser ?
        <form className='new-task' onSubmit={this.handleSubmit.bind(this)}>
          <input type='text' ref='textInput' placeholder='Type to add a new task' />
        </form> : ''
        }

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.PropTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(()=>{
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  };
}, App);
