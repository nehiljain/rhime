var React = require('react');
var ArticleList = React.createClass({

	componentDidMount: function () {
		$('#example tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    } );
 
    // DataTable
    var table = $('#example').DataTable();
 
    // Apply the search
    table.columns().every( function () {
        var that = this;
 
        $( 'input', this.footer() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that.search( this.value ).draw();
            }
        });
    });
	},
	render: function () {

		var articles = [];
		this.props.articles.forEach(function(a){
			if ( a.resolved_title == '' || a.word_count == 0){
				return ;
			}
			var tags = []
			a.tags.forEach(function(t){
				tags = tags.concat( Object.keys(t) )
				
			})
			articles.push(<tr key={a.item_id}>
				<td><a href={"http://getpocket.com/a/read/" + a.item_id} target="_blank">{a.resolved_title}</a></td>
				<td>{tags.join(",")}</td>
				<td>{Math.round(a.word_count/250)}</td>
				<td>{new Date(a.time_added*1000).toString()}</td>
				</tr>);
		})

		return (
		<div className="row">
			<div className="col-sm-12">
				<table className="table table-responsive display" id="example" cellspacing="0" width="100%">
					<thead>
					  	<tr>
							<td>Title</td>
							<td> Tags </td>
							<td>Time (mins)</td>
							<td>Added On</td>
					  	</tr>
					</thead>
					<tbody>{articles}</tbody>
					<tfoot>
					  	<tr>
							<td>Title</td>
							<td> Tags </td>
							<td>Time (mins)</td>
							<td>Added On</td>
					  	</tr>
					</tfoot>
				</table>
			</div>
		</div>
		)
	}
});

module.exports = ArticleList;