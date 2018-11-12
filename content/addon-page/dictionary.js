var dictionary = [];
$(document).ready(function() {

	//Dictionary
  $(document).on('click','#search_btn',function(){

      var by = $("input[name='by']:checked").val();
      var query = $('#search').val();
      if(query == "") {
        return 0;
      }
      smLoader('show');


      if(by == "eword") {
        $('#di_words_cn').empty();
        $.getJSON("d1.json.", function(result){
          var i = 0;
          var data;
          var query_results = [];
          $.each(result, function(ii, field){
            if(field.fields.English.indexOf(query) != 0) {
              //
            }
            else {
                query_results.push(field);
            }
          });

          if(query_results.length == 0) {
            alert('no value finded');
          }
          else {
            dictionary = query_results;

            var first = [];
            first = paginate(dictionary,10,1);

            var total_pages = dictionary.length / 10;
            total_pages = Math.ceil(total_pages);
            var next = '';
            if(total_pages > 1) {
              next = '<button id="di-next" data_pg="2">Next</button>';
            }
            var di_html = '<div style="text-align: right;font-size: 10px;">'+dictionary.length+' Results</div><div id="di_words_inner"><table>';
            $.each(first, function(iii, wfield) {
              di_html = di_html + '<tr><div style="padding: 10px;border-bottom: 1px solid #c2bebe;" id="s_word_cn"><div>'+wfield.fields.English+'</div><div style="font-size: 11px;color: #4b4be1;">'+wfield.fields.PartOfSpeech+'</div><div><li style="list-style: initial;margin-left: 20px;margin-top: 10px;">'+wfield.fields.Expression+'</li></div></div></tr>';
            });
            di_html = di_html + '</table><div id="di_pagination_cn" style="margin-top: 10px;text-align: center;">'+next+'</div>';
            $('#di_words_cn').append(di_html);
            smLoader('hide');
          }
        });
      }


      if(by == "jword") {
        $('#di_words_cn').empty();
        $.getJSON("d1.json.", function(result){
          var i = 0;
          var data;
          var query_results = [];
          $.each(result, function(ii, field){
            if(field.fields.Expression.indexOf(query) != 0) {
              //
            }
            else {
                query_results.push(field);
            }
          });

          if(query_results.length == 0) {
            alert('no value finded');
          }
          else {
            dictionary = query_results;

            var first = [];
            first = paginate(dictionary,10,1);
            console.log(first);
            var total_pages = dictionary.length / 10;
            total_pages = Math.ceil(total_pages);
            var next = '';
            if(total_pages > 1) {
              next = '<button id="di-next" data_pg="2">Next</button>';
            }
            var di_html = '<div style="text-align: right;font-size: 10px;">'+dictionary.length+' Results</div><div id="di_words_inner"><table>';
            $.each(first, function(iii, wfield) {
              di_html = di_html + '<tr><div style="padding: 10px;border-bottom: 1px solid #c2bebe;" id="s_word_cn"><div>'+wfield.fields.English+'</div><div style="font-size: 11px;color: #4b4be1;">'+wfield.fields.PartOfSpeech+'</div><div><li style="list-style: initial;margin-left: 20px;margin-top: 10px;">'+wfield.fields.Expression+'</li></div></div></tr>';
            });
            di_html = di_html + '</table><div id="di_pagination_cn" style="margin-top: 10px;text-align: center;">'+next+'</div>';
            $('#di_words_cn').append(di_html);
            smLoader('hide');
          }
        });
      }


      if(by == "tag") {
        $('#di_words_cn').empty();
        $.getJSON("d1.json.", function(result){
          var i = 0;
          var data;
          var query_results = [];
          $.each(result, function(ii, field){
            if(field.tags.indexOf(query) != 0) {
              //
            }
            else {
                query_results.push(field);
            }
          });

          if(query_results.length == 0) {
            alert('no value finded');
          }
          else {
            dictionary = query_results;

            var first = [];
            first = paginate(dictionary,10,1);
            var total_pages = dictionary.length / 10;
            total_pages = Math.ceil(total_pages);
            var next = '';
            if(total_pages > 1) {
              next = '<button id="di-next" data_pg="2">Next</button>';
            }
            var di_html = '<div style="text-align: right;font-size: 10px;">'+dictionary.length+' Results</div><div id="di_words_inner"><table>';
            $.each(first, function(iii, wfield) {
              di_html = di_html + '<tr><div style="padding: 10px;border-bottom: 1px solid #c2bebe;" id="s_word_cn"><div>'+wfield.fields.English+'</div><div style="font-size: 11px;color: #4b4be1;">'+wfield.fields.PartOfSpeech+'</div><div><li style="list-style: initial;margin-left: 20px;margin-top: 10px;">'+wfield.fields.Expression+'</li></div></div></tr>';
            });
            di_html = di_html + '</table><div id="di_pagination_cn" style="margin-top: 10px;text-align: center;">'+next+'</div>';
            $('#di_words_cn').append(di_html);
            smLoader('hide');
          }
        });
      }
  });

});



//Get Dictionary Paginated Result
$(document).on("click","#di-next , #di-prev", function(){
	var num = $(this).attr('data_pg');
	num = parseInt(num);
	var total_pages = dictionary.length / 10;
	total_pages = Math.ceil(total_pages);
	if(num > total_pages) {
		return 0;
	}
	var first = [];
	first = paginate(dictionary,10,num);
	var prev = "";
	var next = "";

	if(num + 1 <= total_pages) {
		var nnum = num + 1;
		next = '<button id="di-next" data_pg="'+ nnum +'">Next</button>';
	}

	if(num - 1 > 0) {
		var pnum = num - 1;
		prev = '<button id="di-prev" data_pg="'+ pnum +'">Previous</button>';
	}

	var di_html = '<div style="text-align: right;font-size: 10px;">'+dictionary.length+' Results</div><div id="di_words_inner"><table>';
	$.each(first, function(iii, wfield) {
		di_html = di_html + '<tr><div style="padding: 10px;border-bottom: 1px solid #c2bebe;" id="s_word_cn"><div>'+wfield.fields.English+'</div><div style="font-size: 11px;color: #4b4be1;">'+wfield.fields.PartOfSpeech+'</div><div><li style="list-style: initial;margin-left: 20px;margin-top: 10px;">'+wfield.fields.Expression+'</li></div></div></tr>';
	});
	di_html = di_html + '</table><div id="di_pagination_cn" style="margin-top: 10px;text-align: center;">'+prev+next+'</div>';
	$('#di_words_cn').empty();
	$('#di_words_cn').append(di_html);
});





//Paginate Dictionary results
function paginate (array, page_size, page_number) {
  --page_number; // because pages logically start with 1, but technically with 0
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
}