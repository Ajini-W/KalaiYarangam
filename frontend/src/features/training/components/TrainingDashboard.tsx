"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";

export default function TrainingDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Training Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Programs</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">12</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Batches</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">8</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">345</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Trainers</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">5</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

