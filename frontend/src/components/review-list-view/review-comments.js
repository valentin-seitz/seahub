import React from 'react';
import PropTypes from 'prop-types';
import { processor } from '../../utils/seafile-markdown2html';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { seafileAPI } from '../../utils/seafile-api';
import { gettext, draftFilePath, draftRepoID } from '../../utils/constants';
import Loading from '../../components/loading.js';
import reviewComment from '../../models/review-comment.js';
import { username } from '../../utils/constants.js';

import '../../css/review-comments.css';

const commentPropTypes = {
  getCommentsNumber: PropTypes.func.isRequired,
  inResizing: PropTypes.bool.isRequired,
  commentsNumber: PropTypes.number,
  scrollToQuote: PropTypes.func.isRequired
};

class ReviewComments extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      commentsList: [],
      inResizing: false,
      commentFooterHeight: 25,
      showResolvedComment: true,
      comment: '',
    };
  }

  listComments = (scroll) => {
    seafileAPI.listComments(draftRepoID, draftFilePath).then((response) => {
      let commentList = [];
      response.data.comments.forEach(item => {
        let commentItem = new reviewComment(item);
        commentList.push(commentItem);
      });
      this.setState({ commentsList: commentList });
      if (scroll) {
        let that = this;
        setTimeout(() => {
          that.refs.commentsList.scrollTo(0, 10000);
        }, 100);
      }
    });
  }

  handleCommentChange = (event) => {
    this.setState({ comment: event.target.value });
  }

  submitComment = () => {
    let comment = this.state.comment.trim();
    if (comment.length > 0) {
      seafileAPI.postComment(draftRepoID, draftFilePath, comment).then(() => {
        this.listComments(true);
        this.props.getCommentsNumber();
      });
      this.setState({ comment: '' });
    }
  }

  resolveComment = (event) => {
    seafileAPI.updateComment(draftRepoID, event.target.id, 'true').then((res) => {
      this.props.getCommentsNumber();
      this.listComments();
    });
  }

  editComment = (commentID, newComment) => {
    seafileAPI.updateComment(draftRepoID, commentID, null, null, newComment).then((res) => {
      this.props.getCommentsNumber();
      this.listComments();
    });
  }

  toggleResolvedComment = () => {
    this.setState({ showResolvedComment: !this.state.showResolvedComment });
  }

  deleteComment = (event) => {
    seafileAPI.deleteComment(draftRepoID, event.target.id).then((res) => {
      this.props.getCommentsNumber();
      this.listComments();
    });
  }

  onResizeMouseUp = () => {
    if (this.state.inResizing) {
      this.setState({ inResizing: false });
    }
  }

  onResizeMouseDown = () => {
    this.setState({ inResizing: true });
  };

  onResizeMouseMove = (event) => {
    let rate = 100 - (event.nativeEvent.clientY - 120 ) / this.refs.comment.clientHeight * 100;
    if (rate < 20 || rate > 70) {
      if (rate < 20) {
        this.setState({ commentFooterHeight: 25 });
      }
      if (rate > 70) {
        this.setState({ commentFooterHeight: 65 });
      }
      this.setState({ inResizing: false });
      return null;
    }
    this.setState({ commentFooterHeight: rate });
  };
  
  scrollToQuote = (newIndex, oldIndex, quote) => {
    this.props.scrollToQuote(newIndex, oldIndex, quote);
    this.setState({ comment: '' });
  }

  componentWillMount() {
    this.listComments();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.commentsNumber !== nextProps.commentsNumber) {
      this.listComments();
    }
  }

  render() {
    const onResizeMove = this.state.inResizing ? this.onResizeMouseMove : null;
    const { commentsNumber } = this.props;
    const { commentsList } = this.state;
    return (
      <div className={(this.state.inResizing || this.props.inResizing)?
        'seafile-comment seafile-comment-resizing' : 'seafile-comment'}
      onMouseMove={onResizeMove} onMouseUp={this.onResizeMouseUp} ref="comment">
        <div className="seafile-comment-title">
          <div className={'seafile-comment-title-text'}>{gettext('Show resolved comments')}</div>
          <div className={'seafile-comment-title-toggle'}>
            <label className="custom-switch" id="toggle-resolved-comments">
              <input type="checkbox" name="option" className="custom-switch-input"
                onChange={this.toggleResolvedComment}
                checked={this.state.showResolvedComment && 'checked'}
              />
              <span className="custom-switch-indicator"></span>
            </label>
          </div>
        </div>
        <div style={{height:(100 - this.state.commentFooterHeight)+'%'}}>
          {commentsNumber == 0 &&
            <div className="seafile-comment-list">
              <div className="comment-vacant">{gettext('No comment yet.')}</div>
            </div>
          }
          {(commentsList.length === 0 && commentsNumber > 0) &&
            <div className={'seafile-comment-list'}><Loading/></div>
          }
          {commentsList.length > 0 &&
            <ul className="seafile-comment-list" ref='commentsList'>
              {(commentsList.length > 0 && commentsNumber > 0) &&
                commentsList.map((item, index) => {
                  return (
                    <CommentItem
                      item={item}
                      key={index}
                      showResolvedComment={this.state.showResolvedComment}
                      resolveComment={this.resolveComment}
                      editComment={this.editComment}
                      scrollToQuote={this.scrollToQuote}
                      deleteComment={this.deleteComment}
                    />
                  );
                })
              }
            </ul>
          }
        </div>
        <div className="seafile-comment-footer" style={{height:this.state.commentFooterHeight+'%'}}>
          <div className="seafile-comment-row-resize" onMouseDown={this.onResizeMouseDown}></div>
          <div className="seafile-add-comment">
            <textarea
              className="add-comment-input"
              value={this.state.comment}
              placeholder={gettext('Add a comment.')}
              onChange={this.handleCommentChange}
              clos="100" rows="3" warp="virtual"
            ></textarea>
            <Button className="comment-btn" color="success"
              size="sm" onClick={this.submitComment}>
              {gettext('Submit')}</Button>
          </div>
        </div>
      </div>
    );
  }
}

ReviewComments.propTypes = commentPropTypes;

const commentItemPropTypes = {
  item: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  resolveComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
  showResolvedComment: PropTypes.bool.isRequired,
  scrollToQuote: PropTypes.func.isRequired
};

class CommentItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      comment: '',
      quote: '',
      newComment: this.props.item.comment,
      editable: false,
    };
  }

  toggleDropDownMenu = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  convertComment = (item) => {
    processor.process(item.comment).then((result) => {
      let comment = String(result);
      this.setState({ comment: comment });
    });
    processor.process(item.quote).then((result) => {
      let quote = String(result);
      this.setState({ quote: quote });
    });
  }

  scrollToQuote = () => {
    const item = this.props.item;
    this.props.scrollToQuote(item.newIndex, item.oldIndex, item.quote);
  }

  toggleEditComment = () => {
    this.setState({ editable: !this.state.editable });
  }

  updateComment = (event) => {
    const newComment = this.state.newComment;
    if (this.props.item.comment !== newComment) {
      this.props.editComment(event.target.id, newComment);
    }
    this.toggleEditComment();
  }

  handleCommentChange = (event) => {
    this.setState({ newComment: event.target.value });
  }

  componentWillMount() {
    this.convertComment(this.props.item);
  }

  componentWillReceiveProps(nextProps) {
    this.convertComment(nextProps.item);
  }

  render() {
    const item = this.props.item;
    if (item.resolved && !this.props.showResolvedComment) return null;
    if (this.state.editable) {
      return(
        <li className="seafile-comment-item" id={item.id}>
          <div className="seafile-comment-info">
            <img className="avatar" src={item.avatarUrl} alt=""/>
            <div className="reviewer-info">
              <div className="reviewer-name">{item.name}</div>
              <div className="review-time">{item.time}</div>
            </div>
          </div>
          <div className="seafile-edit-comment">
            <textarea
              className="edit-comment-input"
              value={this.state.newComment}
              onChange={this.handleCommentChange}
              clos="100" rows="3" warp="virtual"
            ></textarea>
            <Button className="comment-btn" color="success" size="sm" onClick={this.updateComment} id={item.id}>
              {gettext('Update')}</Button>{' '}
            <Button className="comment-btn" color="secondary" size="sm" onClick={this.toggleEditComment}>
              {gettext('Cancel')}</Button>
          </div>
        </li>
      );
    }
    return (
      <li className={item.resolved ? 'seafile-comment-item seafile-comment-item-resolved'
        : 'seafile-comment-item'} id={item.id}>
        <div className="seafile-comment-info">
          <img className="avatar" src={item.avatarUrl} alt=""/>
          <div className="reviewer-info">
            <div className="reviewer-name">{item.name}</div>
            <div className="review-time">{item.time}</div>
          </div>
          {!item.resolved &&
            <Dropdown isOpen={this.state.dropdownOpen} size="sm"
              className="seafile-comment-dropdown" toggle={this.toggleDropDownMenu}>
              <DropdownToggle className="seafile-comment-dropdown-btn">
                <i className="fas fa-ellipsis-v"></i>
              </DropdownToggle>
              <DropdownMenu>
                {(item.userEmail === username) &&
                  <DropdownItem onClick={this.props.deleteComment}
                    className="delete-comment" id={item.id}>{gettext('Delete')}</DropdownItem>}
                {(item.userEmail === username) &&
                  <DropdownItem onClick={this.toggleEditComment}
                    className="edit-comment" id={item.id}>{gettext('Edit')}</DropdownItem>}
                <DropdownItem onClick={this.props.resolveComment}
                  className="seafile-comment-resolved" id={item.id}>{gettext('Mark as resolved')}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          }
        </div>
        {(item.newIndex >= -1 && item.oldIndex >= -1) &&
          <blockquote className="seafile-comment-content">
            <div onClick={this.scrollToQuote} dangerouslySetInnerHTML={{ __html: this.state.quote }}></div>
          </blockquote>
        }
        <div className="seafile-comment-content" dangerouslySetInnerHTML={{ __html: this.state.comment }}></div>
      </li>
    );
  }
}

CommentItem.propTypes = commentItemPropTypes;

export default ReviewComments;
