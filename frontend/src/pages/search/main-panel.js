import React from 'react';
import ReactDOM from 'react-dom';
import {gettext} from '../../utils/constants';
import {seafileAPI} from "../../utils/seafile-api";
import {Collapse, Button, CustomInput, FormGroup, Label, Input, Col, Row,} from 'reactstrap';


class SearchScales extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="search-scales">
        <Collapse isOpen={this.props.collapse}>

          <div className='search-libraries' style={{padding: '10px'}}>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="libraries" defaultChecked/>
                {gettext('In all libraries')}
              </Label>
            </FormGroup>
          </div>

          <div className='search-file-types' style={{padding: '10px'}}>
            <Row>
              <Col md={5}>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="types" onClick={this.props.closeFileTypeCollapse} defaultChecked/>
                    {gettext('All file types')}
                  </Label>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="types" onClick={this.props.openFileTypeCollapse}/>
                    {gettext('Custom file types')}
                  </Label>
                </FormGroup>
              </Col>
            </Row>

            <Collapse isOpen={this.props.fileTypeCollapse}>
              <FormGroup style={{top: '10px'}}>
                <div>
                  <CustomInput type="checkbox" id="checkTextFiles" label={gettext('Text files')} inline
                               onChange={() => this.props.handlerFileTypes(0)}
                               checked={this.props.fileTypeItemsStatus[0]}/>
                  <CustomInput type="checkbox" id="checkDocuments" label={gettext('Documents')} inline
                               onChange={() => this.props.handlerFileTypes(1)}
                               checked={this.props.fileTypeItemsStatus[1]}/>
                  <CustomInput type="checkbox" id="checkImages" label={gettext('Images')} inline
                               onChange={() => this.props.handlerFileTypes(2)}
                               checked={this.props.fileTypeItemsStatus[2]}/>
                  <CustomInput type="checkbox" id="checkVideo" label={gettext('Video')} inline
                               onChange={() => this.props.handlerFileTypes(3)}
                               checked={this.props.fileTypeItemsStatus[3]}/>
                  <CustomInput type="checkbox" id="checkAudio" label={gettext('Audio')} inline
                               onChange={() => this.props.handlerFileTypes(4)}
                               checked={this.props.fileTypeItemsStatus[4]}/>
                  <CustomInput type="checkbox" id="checkPdf" label={gettext('pdf')} inline
                               onChange={() => this.props.handlerFileTypes(5)}
                               checked={this.props.fileTypeItemsStatus[5]}/>
                  <CustomInput type="checkbox" id="checkMarkdown" label={gettext('markdown')} inline
                               onChange={() => this.props.handlerFileTypes(6)}
                               checked={this.props.fileTypeItemsStatus[6]}/>
                </div>
              </FormGroup>
              <input
                type="text"
                className="form-control search-input"
                name="query"
                autoComplete="off"
                style={{paddingLeft: '0.5rem', width: '30rem',}}
                placeholder={gettext("Input file extensions here, separate with ','")}
                onChange={this.props.handlerFileTypesInput}
              />
            </Collapse>
          </div>

          <div className='search-date' style={{left: '10px'}}>
            <span>{gettext('Last Update')}</span>
            <Row>
              <Col md={5}>
                <FormGroup>
                  <Label htmlFor="exampleDate"></Label>
                  <Input
                    type="date"
                    name="date"
                    id="exampleDate"
                  />
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label htmlFor="exampleDate"></Label>
                  <Input
                    type="date"
                    name="date"
                    id="exampleDate"
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>

          <div className='search-size' style={{left: '10px'}}>
            <span>{gettext('Size')}</span>
            <Row>
              <Col md={5}>
                <FormGroup>
                  <Label htmlFor="size"></Label>
                  <Input type="text" name="size" id="size"/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label htmlFor="size"></Label>
                  <Input type="text" name="size" id="size"/>
                </FormGroup>
              </Col>
            </Row>
          </div>

          <div>
            <Button onClick={this.props.handleSubmitSearch}>{gettext('Submit')}</Button>
          </div>

        </Collapse>
      </div>
    )
  }
}


class SearchResults extends React.Component {
  render() {
    return (
      <div className="message empty-tip">
        <h2>{gettext('No result found')}</h2>
      </div>
    )
  }
}


class SearchViewPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      fileTypeCollapse: false,
      fileTypeItemsStatus: Array(7).fill(false),
      q: '',
      search_repo: '',
      search_ftypes: '',
      ftype: '',
      input_fexts: '',
      date_from: '',
      time_from: '',
      date_to: '',
      time_to: '',
      size_from_mb: '',
      size_from: '',
      size_to_mb: '',
      size_to: '',
      errorMsg: ''
    };
  }

  toggleCollapse = () => {
    this.setState({collapse: !this.state.collapse});
  }
  openFileTypeCollapse = () => {
    this.setState({fileTypeCollapse: true});
  }

  closeFileTypeCollapse = () => {
    this.setState({
      fileTypeCollapse: false,
      fileTypeItemsStatus: Array(7).fill(false),
    });
  }

  handleSearchInput = (event) => {
    let q = event.target.value;
    this.setState({
      q: q
    });
    if (this.state.errorMsg) {
      this.setState({
        errorMsg: ''
      });
    }
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      console.log('click enter', this.state.q);
      this.handleSubmitSearch();
    }
  }

  handlerFileTypes = (i) => {
    this.state.fileTypeItemsStatus[i] = !this.state.fileTypeItemsStatus[i];
    this.setState({
      fileTypeItemsStatus: this.state.fileTypeItemsStatus,
    });
  }

  handlerFileTypesInput = (event) => {
    let input_fexts = event.target.value;
    this.setState({
      input_fexts: input_fexts
    });
    if (this.state.errorMsg) {
      this.setState({
        errorMsg: ''
      });
    }
  }

  handleSubmitSearch = () => {
    console.log(this.state);
    const fileTypeItems = ['Text', 'Document', 'Image', 'Video', 'Audio', 'PDF', 'Markdown'];

      // const searchParams = {};
      // const cancelToken = '';
      //
      // seafileAPI.searchFiles(searchParams, cancelToken).then(res => {
      //   if (!res.data.total) {
      //     this.setState({
      //       resultItems: [],
      //       isResultGot: true
      //     });
      //     this.source = null;
      //     return;
      //   }
      //   let items = this.formatResultItems(res.data.results);
      //   this.setState({
      //     resultItems: items,
      //     isResultGot: true
      //   });
      //   this.source = null;
      // }).catch(res => {
      //   console.log(res);
      // });
      }

  render() {
    return (
      <div style={{width: '60%', margin: '0 auto'}}>

        <div className="search" style={{marginTop: '30px'}}>
          <div className="search-container" style={{padding: '10px', background: '#f7f7f8'}}>
            <div className="input-icon" style={{display: 'flex', alignItems: 'center'}}>
              <input
                type="text"
                className="form-control search-input"
                name="query"
                autoComplete="off"
                style={{paddingLeft: '0.5rem', width: '30rem',}}
                placeholder={gettext('Search Files')}
                onChange={this.handleSearchInput}
                onKeyDown={this.handleKeyDown}
              />
              <i className="search-icon-left input-icon-addon fas fa-search" style={{left: '27rem'}}
                 onClick={this.toggleCollapse}>
              </i>
              <i className="sf2-icon-caret-down action-icon" onClick={this.toggleCollapse}>
              </i>
            </div>

            <SearchScales
              collapse={this.state.collapse}
              fileTypeCollapse={this.state.fileTypeCollapse}
              toggleCollapse={this.toggleCollapse}
              openFileTypeCollapse={this.openFileTypeCollapse}
              closeFileTypeCollapse={this.closeFileTypeCollapse}
              handlerFileTypes={this.handlerFileTypes}
              fileTypeItemsStatus={this.state.fileTypeItemsStatus}
              handlerFileTypesInput={this.handlerFileTypesInput}
              handleSubmitSearch={this.handleSubmitSearch}
            />
          </div>

          <SearchResults/>

        </div>
      </div>
    )
  }
}

export default SearchViewPanel;