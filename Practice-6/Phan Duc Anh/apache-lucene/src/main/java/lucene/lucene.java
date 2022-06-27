package lucene;

import org.apache.lucene.analysis.en.EnglishAnalyzer;
import org.apache.lucene.document.*;
import org.apache.lucene.index.IndexOptions;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.FSDirectory;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;


public class lucene {
    private static final String INDEX_DIR = "/Users/anhphantq/Desktop/Java/apache-lucene/src/main/resources/index";
    public static void main(String[] args) throws IOException {
        IndexWriter writer = createWriter();
        List<Document> documents = new ArrayList<>();

        Document document1 = createDocument(1, "Lokesh", "Gupta", "howtodoinjava.com", "This is an Apple. Apple is the first English word that I remembered");
        documents.add(document1);

        Document document2 = createDocument(2, "Brian", "Schultz", "example.com", "This is another Apple");
        documents.add(document2);

        //Let's clean everything first
        writer.deleteAll();

        for (int i = 1; i < 100; i++) {
            writer.addDocuments(documents);
        }
        writer.commit();

        writer.addDocuments(documents);

        writer.commit();

        writer.close();
    }

    private static Document createDocument(Integer id, String firstName, String lastName, String website, String content)
    {
        Document document = new Document();
        document.add(new StringField("id", id.toString() , Field.Store.YES));
        document.add(new TextField("firstName", firstName , Field.Store.YES));
        document.add(new TextField("lastName", lastName , Field.Store.YES));
        document.add(new TextField("website", website , Field.Store.NO));

        FieldType customFieldType = new FieldType();

        customFieldType.setIndexOptions(IndexOptions.DOCS_AND_FREQS_AND_POSITIONS_AND_OFFSETS);
        customFieldType.setStoreTermVectors(true);
        customFieldType.setStored(true);

        document.add(new Field("content", content , customFieldType));
        return document;
    }

    private static IndexWriter createWriter() throws IOException
    {
        FSDirectory dir = FSDirectory.open(Paths.get(INDEX_DIR));
        IndexWriterConfig config = new IndexWriterConfig(new EnglishAnalyzer());
        IndexWriter writer = new IndexWriter(dir, config);
        return writer;
    }
}
