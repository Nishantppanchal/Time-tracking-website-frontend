// Import React components
import React from 'react';
// Import draft.js components
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  createWithContent,
} from 'draft-js';
// Import draftJS Plugins components
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
// Import CSS styles
import editorStyles from './../Styles/EditorStyles.module.css';
import '@draft-js-plugins/mention/lib/plugin.css';

// Create custom react class component
class DescriptionWithTagsInput extends React.Component {
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
    // Defines the mention component
    mentionComponent(mentionProps) {
      // If the component starts with #ADD TAG:, which it would if it were a new tag
      if (mentionProps.children[0].props.text.startsWith('#ADD TAG: ')) {
        // Creates a edited mention
        const editedMentionPropsChildern = [
          // Creates a new object that combine the original mentionProps with edit props
          Object.assign({}, mentionProps.children[0], {
            props: {
              // The original props are inserted
              ...mentionProps.children[0].props,
              // The text key-value pair is edited to remove the #ADD TAG:
              text: '#' + mentionProps.children[0].props.text.slice(9),
            },
          }),
        ];
        
        // The JSX what will be rendered
        return (
          // A styled span containing the tag value is returned
          <span className={mentionProps.className}>
            {editedMentionPropsChildern}
          </span>
        );
      // Otherwise if the tag already exists
      } else {
        // The JSX what will be rendered
        return (
          // A styled span containing the tag value is returned
          <span className={mentionProps.className}>
            {mentionProps.children}
          </span>
        );
      }
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
    });
  };

  // Handles updating the tags suggestion menu
  onSearchChange = ({ value }) => {
    // Removes whitespaces from both ends of the string
    const trimmedValue = value.trim();
    // Creates a copy of the array of all the tags 
    const tags = this.props.tags.slice();

    // If there is not a value that exactly matches the input
    if (!tags.some((tag) => tag.name == trimmedValue)) {
      if (!trimmedValue.charAt(trimmedValue.length - 1) == '*') {
        // Creates a dictionary for the new tag with billable as true
        const newTag = {
          billable: true,
          name: 'ADD TAG: ' + trimmedValue,
          // newValue is a extra key-value pair used to create the new tags
          newValue: true,
        };
        // Add the new tag to the front of the tags array
        tags.unshift(newTag);
      // Otherwise, if the last character is not *
      } else {
        // Creates a dictionary for the new tag with billable as false
        const newTag = {
          billable: false,
          name: 'ADD TAG: ' + trimmedValue,
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
  };

  // Handles clearing the textfield
  clearField = () => {
    // Sets the editor states to be empty
    this.setState({
      ...this.state,
      editorState: EditorState.createEmpty(),
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
  }

  // Defines what HTML code is displayed by this component
  render() {
    // Creates a MentionSuggestions component
    const { MentionSuggestions } = this.mentionPlugin;
    // Creates a array of plugins (Just followed documentation)
    const plugins = [this.mentionPlugin];

    // This is what the JSX rendered by this component
    return (
      // Div styled with CSS
      <div className={editorStyles.editor}>
        {/* The component that the user types into */}
        <Editor
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
        />
      </div>
    );
  }
}

// Exports the DescriptionWithTagsInput component
export default DescriptionWithTagsInput;
