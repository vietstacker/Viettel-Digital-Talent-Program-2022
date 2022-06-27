package lucene;

import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.*;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;

import java.io.IOException;
import java.nio.file.Paths;

public class searching {
    private static final String INDEX_DIR = "/Users/anhphantq/Desktop/Java/apache-lucene/src/main/resources/index";

    public static void main(String[] args) throws IOException {
        IndexSearcher searcher = createSearcher();

        // TermQuery
        System.out.println("TermQuery: ");
        TermQuery tq = new TermQuery(new Term("content", "appl"));
        TopDocs topDocs_tq = searcher.search(tq, 1);
        ScoreDoc[] docs_tq = topDocs_tq.scoreDocs;
        for (int i = 0; i < docs_tq.length; i++){
            System.out.println(i + " " + docs_tq[i].score + " " + searcher.doc(docs_tq[i].doc).get("content"));
        }

        // PhraseQuery
        int slop = 0;
        System.out.println("PhraseQuery (slop: "+ slop +"): ");
        PhraseQuery fq = new PhraseQuery(slop,"content", "word", "rememb");
        TopDocs topDocs_fq = searcher.search(fq, 1);
        ScoreDoc[] docs_fq = topDocs_fq.scoreDocs;
        for (int i = 0; i < docs_fq.length; i++){
            System.out.println(i + " " + docs_fq[i].score + " " + searcher.doc(docs_fq[i].doc).get("content"));
        }
    }


    private static IndexSearcher createSearcher() throws IOException {
        Directory dir = FSDirectory.open(Paths.get(INDEX_DIR));
        IndexReader reader = DirectoryReader.open(dir);
        IndexSearcher searcher = new IndexSearcher(reader);
        return searcher;
    }
}
