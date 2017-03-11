import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

//import { Tasks } from '../api/tasks.js';

export default class Task extends Component {
  toggleChecked() {
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  render() {
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });

    return (
      <li className={taskClassName}>

          <button className="clickable task-status" onClick={this.toggleChecked.bind(this)}>
            { this.props.task.checked ? 'Completed' : 'Incomplete' }
          </button>

          { this.props.showPrivateButton ? (
            <button className="toggle-private clickable" onClick={this.togglePrivate.bind(this)}>
              { this.props.task.private ? 'Private' : 'Public' }
            </button>
          ) : ''}

          <span className="text">
            <strong>{this.props.task.username}</strong>: {this.props.task.text}
          </span>

          <button className="delete" onClick={this.deleteThisTask.bind(this)}>
            &times;
          </button>

      </li>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired
};
