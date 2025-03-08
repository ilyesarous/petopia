package tn.esprit.petopia_backend.controller.vet;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import tn.esprit.petopia_backend.entities.vet.Diagnosis;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;

public class QRCodeGenerator {

    public static void generateQRCode(Diagnosis diagnosis) throws WriterException, IOException {
        String qrCodePath = "D:\\4_PI_Cloud\\Phase4";
        String qrCodeName = qrCodePath+"\\"+diagnosis.getIdDiagnosis()+"-QRCODE.png";
        var qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(
                "ID: "+diagnosis.getIdDiagnosis()+ "\n"+
                        "diagnosis_date: "+diagnosis.getDiagnosis_date()+ "\n"+
                        "diagnosis description: "+diagnosis.getDiagnosis_description()+ "\n"+
                        "pet name: "+diagnosis.getPetdiagnosis().getPetName()+ "\n"+
                        "pet breed: "+diagnosis.getPetdiagnosis().getBreed()+ "\n"+
                        "pet location: "+diagnosis.getPetdiagnosis().getLocation(), BarcodeFormat.QR_CODE, 400, 400);
        Path path = FileSystems.getDefault().getPath(qrCodeName);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);

    }
}
