import React from 'react';
import uuid from 'uuid';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CategorySelect from '../../category/categorySelect';
import { Creators as PostActions } from '../../../redux/post/postActions';

const INITIAL_POST = {
  id: '',
  body: '',
  title: '',
  author: '',
  category: null
};

let style = {
  position: 'fixed',
  right: '25px',
  bottom: '25px',
  zIndex: '10'
};

class PostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      post: { ...INITIAL_POST },
      postError: '',
      titleError: '',
      authorError: ''
    };
    this.baseState = this.state;
    this.closeModal = this.closeModal.bind(this);
  }

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.select.clearSelect();
    const post = { ...INITIAL_POST };
    this.setState({ post: post, open: false });
  };

  handleBodyChange = e => {
    const { post } = this.state;
    post.body = e.target.value;

    this.setState({ post }, () => {
      this.validateBody();
    });
  };

  validateBody = () => {
    const { body } = this.state.post;
    this.setState({
      postError: body.length > 3 ? null : 'The post body must be longer than 3 characters'
    });
  };

  handleTitleChange = e => {
    const { post } = this.state;
    post.title = e.target.value;

    this.setState({ post }, () => {
      this.validateTitle();
    });
  };

  validateTitle = () => {
    const { title } = this.state.post;
    this.setState({
      titleError: title.length > 3 ? null : 'The Title must be longer than 3 characters'
    });
  };

  handleAuthorChange = e => {
    const { post } = this.state;
    post.author = e.target.value;

    this.setState({ post }, () => {
      this.validateAuthor();
    });
  };

  validateAuthor = () => {
    const { author } = this.state.post;
    this.setState({
      authorError: author.length > 3 ? null : 'The Author name must be longer than 3 characters'
    });
  };

  handleCategorySelect = category => {
    const { post } = this.state;
    post.category = category;
    this.setState({ post });
  };

  handleSubmit = () => {
    const { addPostRequest } = this.props;
    let post = {
      ...this.state.post,
      id: uuid.v4().replace(/-/g, ''),
      timestamp: Date.now(),
      voteScore: 0,
      deleted: false,
      commentCount: 0
    };
    addPostRequest(post);
    this.closeModal();
  };

  render() {
    let disable = !this.state.post.category || this.state.titleError || this.state.postError;

    return (
      <div>
        <button type="button" className="btn btn-primary" style={style} onClick={this.openModal}>
          <i className="plus circle icon" />
        </button>
        <div
          className="modal fade in"
          id="modal-default"
          style={{ paddingRight: '15px', display: this.state.open ? 'block' : 'none' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={this.closeModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
                <h4 className="modal-title">Create Post</h4>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className={`form-group ${this.state.titleError ? 'has-error' : ''} `}>
                      <label htmlFor="post-text">Title*: </label>
                      <input
                        value={this.state.post.title}
                        type="text"
                        onChange={this.handleTitleChange}
                        className="form-control"
                        placeholder="Enter a title"
                      />
                      <span>{this.state.titleError}</span>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className={`form-group ${this.state.authorError ? 'has-error' : ''} `}>
                      <label>Author*: </label>
                      <input
                        value={this.state.post.author}
                        type="text"
                        onChange={this.handleAuthorChange}
                        className="form-control"
                        placeholder="Enter a title"
                      />
                      <span>{this.state.authorError}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Category*: </label>
                      <CategorySelect
                        onRef={ref => (this.select = ref)}
                        handleSelect={this.handleCategorySelect}
                        selectedOption={this.state.post.category}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className={`form-group ${this.state.postError ? 'has-error' : ''} `}>
                      <label htmlFor="post-text">Post*: </label>
                      <textarea
                        value={this.state.post.body}
                        type="text"
                        onChange={this.handleBodyChange}
                        className="form-control"
                        placeholder="Enter a text to post"
                      />
                      <span>{this.state.postError}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default pull-left"
                  onClick={this.closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handleSubmit}
                  disabled={disable}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(PostActions, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(PostModal);
