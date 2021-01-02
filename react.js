import React from 'react';

const Comment = (props) => <Text>{props.comment.text}</Text>;

const domContainer = document.querySelector('#react');

ReactDOM.render( e( Comment ) , domContainer );

console.log(domContainer);