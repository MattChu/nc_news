\c nc_news_test

\o test_count_comments_output.txt

SELECT articles.author, articles.title, article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments) AS INT) AS comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY article_id ORDER BY articles.created_at DESC;

\o test_comments_by_article_id_output.txt
SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = 1;