var React = require('react');

var Tags = React.createClass({

	componentDidMount: function () {
		/*$('#example tfoot th').each( function () {
				var title = $(this).text();
				$(this).html( '<input type="text" placeholder="search '+title+'" />' );
		} );
 
		// datatable
		var table = $('#example').datatable();
 
		// apply the search
		table.columns().every( function () {
				var that = this;
 
				$( 'input', this.footer() ).on( 'keyup change', function () {
						if ( that.search() !== this.value ) {
								that.search( this.value ).draw();
						}
				});
		});*/
	},
	render: function () {
		var tags = this.props.tags || [];
		if(!Array.isArray(tags) || tags.length == 0){
			return null;
		}
		
		var tagsHtml = []
		Object.keys( tags[0] ).forEach(function(item,index){
			tagsHtml.push( <span key={index} className="label label-danger"> {item} </span>);
		})

		return (
			<div classname="col-sm-12">
				{tagsHtml}
			</div>
		)
	}
});

module.exports = Tags;