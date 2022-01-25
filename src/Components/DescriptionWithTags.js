import React from 'react';
import { EditorState, convertToRaw, convertFromRaw, createWithContent } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention'
import editorStyles from './../Styles/EditorStyles.module.css';
import '@draft-js-plugins/mention/lib/plugin.css';


class DescriptionWithTagsInput extends React.Component {
    constructor(props) {
        super(props);
      };

      state = {
        editorState: (this.props.empty ? EditorState.createEmpty() : EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.intialField)))),
        suggestions: this.props.tags,
        open: false,
      };
    
      mentionPlugin = createMentionPlugin({
        entityMutability: 'IMMUTABLE',
        mentionPrefix: '#',
        mentionTrigger: '#',
        supportWhitespace: true,
        mentionComponent(mentionProps) {
          if (mentionProps.children[0].props.text.startsWith('#ADD TAG: ')) {
            const editedMentionPropsChildern = [Object.assign({}, mentionProps.children[0], { 
              props: { 
                ...mentionProps.children[0].props, 
                text: ('#' + mentionProps.children[0].props.text.slice(9)), 
              }, 
            })]

            return (
              <span
                className={mentionProps.className}
              >
                {editedMentionPropsChildern}
              </span>
            );
          } else {
            return (
              <span
                className={mentionProps.className}
              >
                {mentionProps.children}
              </span>
            );
          }
        },
      });


      onChange = editorState => {
        this.setState({ editorState });
        const contentState = this.state.editorState.getCurrentContent();
        const raw = convertToRaw(contentState);
        let tags = [];
        for (let key in raw.entityMap) {
          const entity = raw.entityMap[key];
          if (entity.type === '#mention') {
            tags.push(entity.data.mention);
          }
        }
        this.props.data({
          raw: raw,
          tags: tags,
        })
      };
    
      onSearchChange = ({ value }) => {
        const trimmedValue = value.trim()
        const tags = this.props.tags.slice()
        if(tags.some(tag => tag.name == trimmedValue)) {
          this.setState({
            ...this.state,
            suggestions: defaultSuggestionsFilter(trimmedValue,  tags),
          });
        } else if (trimmedValue.charAt(trimmedValue.length - 1) == '*') {
          const newTag = {
            billable: true,
            name: 'ADD TAG: ' + (trimmedValue),
            newValue: true,
          }
          tags.unshift(newTag)
          this.setState({
            ...this.state,
            suggestions: defaultSuggestionsFilter(trimmedValue,  tags),
          });
        } else {
          const newTag = {
            billable: false,
            name: 'ADD TAG: ' + (trimmedValue),
            newValue: true,
          }
          tags.unshift(newTag)
          this.setState({
            ...this.state,
            suggestions: defaultSuggestionsFilter(trimmedValue, tags),
          });
        }
      };
    
      onOpenChange = (isOpen) => {
          this.setState({
              ...this.state,
              open: isOpen,
          });
      }

      clearField = () => {
        this.setState({
          ...this.state,
          editorState: EditorState.createEmpty(),
        })
      }

      componentDidUpdate(prevProps) {
        if (prevProps.clear !== this.props.clear) {
          this.clearField()
        }
      }

      render() {        
        const { MentionSuggestions } = this.mentionPlugin;
        const plugins = [this.mentionPlugin];

        return (
          <div className={editorStyles.editor}>
              <Editor
                editorState={this.state.editorState}
                onChange={this.onChange}
                plugins={plugins}
              />
              <MentionSuggestions
                open={this.state.open}
                onOpenChange={this.onOpenChange}
                onSearchChange={this.onSearchChange}
                suggestions={this.state.suggestions}
              />
          </div>
        );
      }
};

export default DescriptionWithTagsInput;