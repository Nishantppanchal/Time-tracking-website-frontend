// Import React components
import React from 'react';
// Import draft.js components
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
// Import draftJS Plugins components
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
// Import CSS styles
import editorStyles from './../Styles/EditorStyles.module.css';
import '@draft-js-plugins/mention/lib/plugin.css';

import Typography from '@mui/material/Typography';
import getTheme from './GetTheme';

import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@mui/styles';
import { Paper } from '@mui/material';

// Create custom react class component
class MentionsTextfield extends React.Component {
  // Intialise the component state
  constructor(props) {
    // Allows this and this.props to be called
    // Props is passed through to all props access with the constructor
    super(props);
    // Sets this.states
    this.state = {
      // If empty is true, make editorState emtpy
      // Otherwise intialField is parsed and set as editorState
      editorState: this.props.empty
        ? EditorState.createEmpty()
        : EditorState.createWithContent(
            convertFromRaw(JSON.parse(this.props.intialField))
          ),
      // Sets the suggestions to all the tags
      suggestions: this.props.tags,
      // Sets the suggestions menu to closed by default
      open: false,
      mode: this.props.mode,
    };
  }

  // Creates mentionPlugin function
  mentionPlugin = createMentionPlugin({
    // Sets mentionPlugin to immutable
    entityMutability: 'IMMUTABLE',
    // Add # to the front of all tags
    mentionPrefix: '#',
    // Triggers mentions when # is typed
    mentionTrigger: '#',
    // Allow for tags to have whitespaces
    supportWhitespace: true,
    // Customize the characters that can be used in tags
    // This allow all the alphabet, numbers and astrick (*)
    mentionRegExp: '[A-Za-z0-9*]',
    theme: {
      mention: editorStyles.mention,
      mentionSuggestions: editorStyles.popover,
      mentionSuggestionsEntry: editorStyles.entry,
      mentionSuggestionsEntryFocused: editorStyles.entryFocused,
    },
    // Defines the mention component
    mentionComponent(mentionProps) {
      // The JSX what will be rendered
      return (
        // A styled span containing the tag value is returned
        <span
          className={mentionProps.className}
          style={{
            backgroundColor: getTheme().palette.secondary.light,
            color: getTheme().palette.secondary.main,
          }}
        >
          {mentionProps.children}
        </span>
      );
    },
  });

  // Handles content change in the textfield
  onChange = (editorState) => {
    // Sets states to contain with new editorState
    this.setState({ editorState });
    // get the content in the textfield
    const contentState = this.state.editorState.getCurrentContent();
    // Converts the contentState to raw javascript
    const raw = convertToRaw(contentState);

    // Defines a empty array to the variable tags
    var tags = [];
    // For all the tags in the textfield
    for (let key in raw.entityMap) {
      // Get tag entity
      const entity = raw.entityMap[key];
      // If the entity is a mention
      if (entity.type === '#mention') {
        // Appends the tag ID to the tags array
        tags.push(entity.data.mention);
      }
    }

    // Push the raw content and the array of tags IDs as a dictionary to the data prop
    this.props.data({
      raw: raw,
      tags: tags,
      updateTags: this.updateTags,
    });
  };

  // Function that defines how suggestions are rendered
  Entry = (props) => {
    // Extracts info from props
    const { mention, ...parentProps } = props;

    // If the mention is a newValue
    if (mention.newValue) {
      // This is the JSX rendered
      return (
        // Div with parent props pass through
        <div {...parentProps}>
          {/* Mention name with ADD TAG: at the start */}
          {'ADD TAG: ' + mention.name}
        </div>
      );
    }
    // Otherwise, if the mention is not new
    // This is the JSX rendered
    return (
      // Div with parent props pass through
      <div {...parentProps}>{mention.name}</div>
    );
  };

  // Handles updating the tags suggestion menu
  onSearchChange = ({ value }) => {
    // Removes whitespaces from both ends of the string
    const trimmedValue = value.trim();
    // Creates a copy of the array of all the tags
    const tags = this.props.tags.slice();

    // If there is not a value that exactly matches the input
    if (!tags.some((tag) => tag.name === trimmedValue)) {
      if (trimmedValue.charAt(trimmedValue.length - 1) === '*') {
        // Creates a dictionary for the new tag with billable as true
        const newTag = {
          billable: false,
          name: trimmedValue,
          // newValue is a extra key-value pair used to create the new tags
          newValue: true,
        };
        // Add the new tag to the front of the tags array
        tags.unshift(newTag);
        // Otherwise, if the last character is not *
      } else {
        // Creates a dictionary for the new tag with billable as false
        const newTag = {
          billable: true,
          name: trimmedValue,
          // newValue is a extra key-value pair used to create the new tags
          newValue: true,
        };
        // Add the new tag to the fron
        tags.unshift(newTag);
      }
    }

    // Sets the suggestions to the tags array filtered
    // Only tags the contain the trimmedValue are included
    this.setState({
      ...this.state,
      suggestions: defaultSuggestionsFilter(trimmedValue, tags),
    });
  };

  // Handles openning and closing the suggestion menu
  onOpenChange = (isOpen) => {
    // Sets the open state to whatever is passthrough isOpen
    this.setState({
      ...this.state,
      open: isOpen,
    });

    if (!isOpen) {
      this.onChange(this.state.editorState)
    } 
  };

  // Handles clearing the textfield
  clearField = () => {
    // Sets the editor states to be empty
    this.setState({
      ...this.state,
      editorState: EditorState.createEmpty(),
    });
  };

  updateTags = (tags) => {
    // Sets states to contain with new editorState
    const { editorState } = this.state;
    // get the content in the textfield
    const contentState = this.state.editorState.getCurrentContent();
    // Converts the contentState to raw javascript
    const raw = convertToRaw(contentState);

    for (let key in raw.entityMap) {
      if (raw.entityMap[key].type === '#mention' && raw.entityMap[key].data.mention.newValue == true) {
        const name = raw.entityMap[key].data.mention.name;
        raw.entityMap[key].data.mention = tags.find((tag) => tag.name === name);
      }
    }

    this.setState({
      ...this.state,
      editorState: EditorState.createWithContent(convertFromRaw(raw)),
    });
  };

  // Checks if props have changed
  componentDidUpdate(prevProps) {
    // If the prop clear has changed
    if (prevProps.clear !== this.props.clear) {
      // Run the function clearField
      // This will clear the textfield
      this.clearField();
    }
    // Check if the mode has changed
    if (prevProps.mode !== this.props.mode) {
      this.setState({
        ...this.state,
        mode: this.props.mode,
        m: this.mentionPlugin,
      });
      // Creates mentionPlugin function
      this.mentionPlugin = createMentionPlugin({
        // Sets mentionPlugin to immutable
        entityMutability: 'IMMUTABLE',
        // Add # to the front of all tags
        mentionPrefix: '#',
        // Triggers mentions when # is typed
        mentionTrigger: '#',
        // Allow for tags to have whitespaces
        supportWhitespace: true,
        // Customize the characters that can be used in tags
        // This allow all the alphabet, numbers and astrick (*)
        mentionRegExp: '[A-Za-z0-9*]',
        // Defines the mention component
        mentionComponent(mentionProps) {
          // The JSX what will be rendered
          return (
            // A styled span containing the tag value is returned
            <span
              className={editorStyles.mention}
              style={{
                backgroundColor: getTheme().palette.secondary.light,
                color: getTheme().palette.text.primary,
              }}
            >
              {mentionProps.children}
            </span>
          );
        },
      });
    }
  }

  // Defines what HTML code is displayed by this component
  render() {
    // Creates a MentionSuggestions component
    const { MentionSuggestions } = this.mentionPlugin;
    // Creates a array of plugins (Just followed documentation)
    const plugins = [this.mentionPlugin];

    // This is what the JSX rendered by this component
    return (
      <div style={{ position: 'relative' }}>
        {/* Div styled with CSS */}
        <div
          className={
            this.props.readOnly ? editorStyles.readOnly : editorStyles.editor
          }
          tabIndex={1}
        >
          {this.props.readOnly ? null : (
            <Typography variant='caption' className={editorStyles.label}>
              DESCRIPTION
            </Typography>
          )}
          {/* The component that the user types into */}
          <Editor
            readOnly={this.props.readOnly}
            // Sets editor state to the editorState value in state
            editorState={this.state.editorState}
            // Assign the onChange function to run when there is a change
            onChange={this.onChange}
            // Defines the plugins
            plugins={plugins}
          />
          {/* The component that shows the suggestion for tags */}
          <MentionSuggestions
            // Sets the open states to the open value in state
            open={this.state.open}
            // Assign onOpenChange to run when the suggestion need to close or open
            onOpenChange={this.onOpenChange}
            // Assigns onSearchChange to run when the tag value changes
            onSearchChange={this.onSearchChange}
            // Sets the suggestions to the suggestions array in state
            suggestions={this.state.suggestions}
            // Defines how the suggestions are displayed
            entryComponent={this.Entry}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { mode } = state;
  return { mode: mode.value };
}

// Exports the DescriptionWithTagsInput component
export default connect(mapStateToProps)(MentionsTextfield);
