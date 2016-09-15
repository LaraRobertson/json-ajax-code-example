<mobile-feed>

	<ul>
		<li each={notifications}>
			<p><strong>{displayDate}</strong><br><raw content="{text}"/></p>
	    </li>
    </ul>

	<style>
		mobile-feed ul li {
			background: #fff;
		}

		mobile-feed li div {
			height: auto;
		}

	</style>

	<script>
		var self = this;

		var locale = 'en-us';

		function dateView(date){
			var d = date;
			var month = d.toLocaleString(locale, {month: 'long'});
			var day = d.getDay();
			var year = d.getFullYear();

			// return month + ' ' + day + ', ' + year;
			return month + ' ' + day;

		}
		var n = $.parseJSON(JSON.stringify(messages.notifications));

		n.forEach(function(message){
			var parts = message.date.split(' ');
			var full = parts[0] + 'T' + parts[1];
			message.date = new Date(full);
//			console.log(message.date)
//			console.log(dateView(message.date));
			message.displayDate = dateView(message.date);
		});

		n.sort(function(a,b){
			if(opts.hasOwnProperty('order') && opts.order == 'descending'){
				if(a.date > b.date){
					return -1;
				}
				if(a.date < b.date){
					return 1;
				}
				return 0;	
			} else {
				if(a.date < b.date){
					return -1;
				}
				if(a.date > b.date){
					return 1;
				}
				return 0;
			}
			
		});

		self.notifications = n;
		// self.update();

	</script>

</mobile-feed>