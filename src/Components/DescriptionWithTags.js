import React from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention'
import editorStyles from './../Styles/EditorStyles.module.css';
import mentions from './mentions(temp)';
import '@draft-js-plugins/mention/lib/plugin.css';


class DescriptionWithTagsInput extends React.Component {
    constructor(props) {
        super(props);
        this.mentionPlugin = createMentionPlugin({
          entityMutability: 'IMMUTABLE',
          mentionPrefix: '#',
          mentionTrigger: '#',
          supportWhitespace: true,
          mentionComponent(mentionProps) {
            return (
              <span
                className={mentionProps.className}
                onClick={() => alert('Clicked on the Mention!')}
              >
                {mentionProps.children}
              </span>
            );
          },
        });
      }
    
      state = {
        editorState: EditorState.createEmpty(),
        suggestions: this.props.tags,
        open: false,
      };
    
      onChange = editorState => {
        this.setState({ editorState });
      };
    
      onSearchChange = ({ value }) => {
        this.setState({
            ...this.state,
            suggestions: defaultSuggestionsFilter(value, this.props.tags),
        });
      };
    
      onOpenChange = (isOpen) => {
          this.setState({
              ...this.state,
              open: isOpen,
          })
      }

      onExtractData = () => {
        const contentState = this.state.editorState.getCurrentContent();
        const raw = convertToRaw(contentState);
        console.log(raw);
      }

      onExtractMentions = () => {
        const contentState = this.state.editorState.getCurrentContent();
        const raw = convertToRaw(contentState);
        let tags = [];
        for (let key in raw.entityMap) {
          const ent = raw.entityMap[key];
          if (ent.type === 'mention') {
            tags.push(ent.data.mention);
          }
        }
        console.log(tags);
      };

      render() {        
        const { MentionSuggestions } = this.mentionPlugin;
        const plugins = [this.mentionPlugin];
        console.log(this.props.tags)

        return (
            <div>
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
                <div>
                    <button onClick={() => this.onExtractData()}>Extract Data</button>
                    <button onClick={() => this.onExtractMentions()}>Extract mentions</button>
                </div>
          </div>
        );
      }
};

export default DescriptionWithTagsInput;