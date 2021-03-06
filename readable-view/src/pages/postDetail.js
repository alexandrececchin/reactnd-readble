import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Post from '../components/posts/post/post';
import Comments from '../components/comments/comments';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as PostActions } from '../redux/post/postActions';
import { Creators as CommentActions } from '../redux/comment/commentActions';
import { Selectors } from '../redux/rootReducer';
import PostModal from '../components/posts/post/postModal';

class postDetail extends Component {
  componentDidMount() {
    const { category, id } = this.props.match.params;
    const { fetchSinglePostRequest, fetchCommentsRequest } = this.props;
    fetchSinglePostRequest(id, category);
    fetchCommentsRequest(id);
  }

  render() {
    const id = this.props.match.params.id;
    const { commentsToRender, redirect } = this.props;
    if (redirect) {
      return <Redirect to="/404" />;
    }

    return (
      <div className="col-md-10 col-md-offset-1">
        <PostModal />
        <div className="box-footer box-comments">
          <Post id={id} />
          <Comments postId={id} comments={commentsToRender} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...PostActions, ...CommentActions }, dispatch);

function mapStateToProps(state, props) {
  const { category, id } = props.match.params;

  let commentsToRender = Selectors.comments.getVisibleComments(state, id);

  let post = Selectors.posts.getPost(state, id);
  console.log('object :', post);
  let redirect = false;

  if (post && post.deleted) {
    redirect = true;
  }

  return {
    category,
    id,
    commentsToRender,
    redirect
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(postDetail)
);
