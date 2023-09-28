<?php
class ImageUpload {
    const MAX_IMAGE_SIZE = 20;
    const PARENT_DIRECTORY = '../'; // This is the relative path to the directories appImages and appAudios
    /**
     * Returns an error message $message to ckEditor as a json, which obeys the prescribed protocol
     * 
     * @param string $message 
     * @return void 
     */
    private function error(string $message) {
        $response = array('error' => array('message' => $message));
        $json = json_encode($response);
        echo $json;
        die; // This is essential. Otherwise multiple jsons would not fullfill the required protocol
    }
    /**
     * Returns either true or a string, giving a cue to the error
     * 
     * @return bool|string 
     */
    private function validate(string $mainMime, string $secondaryMime) {
        $oriName = pathinfo($_FILES['upload']['name'],PATHINFO_BASENAME);
		$tmpName = $_FILES['upload']['tmp_name'];
        // Check the size
		$filesize = round(filesize($tmpName) / 1024);
        if ($filesize > self::MAX_IMAGE_SIZE) {
            // return 'The size of '.$oriName.' is '.$filesize.'k and exceeds the allowed size of '.self::MAX_IMAGE_SIZE.'k';
        }
        // Check the mime type
        if ($mainMime == 'image') {
            $allowedFormats = array('jpeg', 'jpg', 'png', 'gif', 'bmp');
            if (!in_array($secondaryMime, $allowedFormats)) {
                return 'Format image/'.$secondaryMime.' of "'.$oriName.'" is not allowed';
            }
        } elseif ($mainMime == 'audio') {

        } 
        return true;
    }
    /**
     * Returns an array with keys 'error' and 'filename'.
     * 
     * @return array 
     */
    private function storeImage(string $path):array {
        $stored = array('error' => '', 'filename' => '');
        $fileName = pathinfo($_FILES['upload']['name'],PATHINFO_BASENAME);
        $to = self::PARENT_DIRECTORY.substr($path,3).$fileName;
        $ok = move_uploaded_file($_FILES['upload']['tmp_name'], $to);
        if ($ok) {
            $stored['filename'] = $fileName;
        } else {
            $stored['error'] = 'The file could not be uploaded';
        }
        return $stored;
    }
    public function store() {
        
        try {
            $mimeType = mime_content_type($_FILES['upload']['tmp_name']);
        } catch (Throwable $ex) {
            $this->error($ex->getMessage());
        }
        $parts = mb_split('/', $mimeType);
        if (!isset($parts[0]) || !isset($parts[1])) {
            $this->error('Cannot detect mime type of file');
        }
        $this->validate($parts[0], $parts[1]); // Terminates on error with $this->error
        if ($parts[0] == 'image') {
            $path = '../appImages/';
        } elseif ($parts[0] == 'audio') {
            $path = '../appAudios/';
        } else {
            $this->error('Unsupported mime type');
        }
        $stored = $this->storeImage($path);
        if ($stored['error'] != '') {
            $this->error($stored['error']);
        } else {
            $url = $path.$stored['filename'];
            $response = array('url' => $url);
            $json = json_encode($response);
            echo $json;
            die;
        }
        $this->error('Not yet implemented');
    }
}
$imageUpload = new ImageUpload();
$imageUpload->store();

