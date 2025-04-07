
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UploadSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Research Output</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Upload New Output</Button>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
